#!/usr/bin/env swift

import CoreImage
import Foundation
import UniformTypeIdentifiers
import Vision

enum CutoutError: Error, CustomStringConvertible {
    case usage
    case unreadableImage(String)
    case noForeground(String)
    case renderFailed(String)

    var description: String {
        switch self {
        case .usage:
            return "usage: remove_product_background.swift <input> <output.png>"
        case .unreadableImage(let path):
            return "could not read image: \(path)"
        case .noForeground(let path):
            return "Vision found no foreground instances: \(path)"
        case .renderFailed(let path):
            return "could not render PNG: \(path)"
        }
    }
}

func run() throws {
    guard CommandLine.arguments.count == 3 else { throw CutoutError.usage }

    let inputPath = CommandLine.arguments[1]
    let outputPath = CommandLine.arguments[2]
    let inputURL = URL(fileURLWithPath: inputPath)
    let outputURL = URL(fileURLWithPath: outputPath)

    guard let source = CIImage(contentsOf: inputURL, options: [.applyOrientationProperty: true]) else {
        throw CutoutError.unreadableImage(inputPath)
    }

    let handler = VNImageRequestHandler(url: inputURL, options: [:])
    let request = VNGenerateForegroundInstanceMaskRequest()
    try handler.perform([request])

    guard let observation = request.results?.first, !observation.allInstances.isEmpty else {
        throw CutoutError.noForeground(inputPath)
    }

    let maskBuffer = try observation.generateScaledMaskForImage(
        forInstances: observation.allInstances,
        from: handler
    )
    let mask = CIImage(cvPixelBuffer: maskBuffer)
    let transparent = CIImage(color: .clear).cropped(to: source.extent)
    let cutout = source.applyingFilter("CIBlendWithMask", parameters: [
        kCIInputBackgroundImageKey: transparent,
        kCIInputMaskImageKey: mask,
    ])

    try FileManager.default.createDirectory(
        at: outputURL.deletingLastPathComponent(),
        withIntermediateDirectories: true
    )

    let context = CIContext(options: [.cacheIntermediates: false])
    let colorSpace = CGColorSpace(name: CGColorSpace.sRGB)!
    try context.writePNGRepresentation(
        of: cutout,
        to: outputURL,
        format: .RGBA8,
        colorSpace: colorSpace
    )

    guard FileManager.default.fileExists(atPath: outputPath) else {
        throw CutoutError.renderFailed(outputPath)
    }

    let report: [String: Any] = [
        "input": inputPath,
        "output": outputPath,
        "width": Int(source.extent.width),
        "height": Int(source.extent.height),
        "instances": observation.allInstances.count,
    ]
    let data = try JSONSerialization.data(withJSONObject: report, options: [.sortedKeys])
    print(String(decoding: data, as: UTF8.self))
}

do {
    try run()
} catch {
    fputs("ERROR: \(error)\n", stderr)
    exit(1)
}
