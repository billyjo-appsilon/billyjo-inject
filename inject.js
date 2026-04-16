// BillyJo Inject - Auto-generated from logscript
// Generated: 2026-04-15

(function() {
  // === CSS Injection ===
  var css = "\n/* Hide categories from navigation */\n.gnb__menu a[href*=\"prod_list/11-\"],\n.gnb__menu a[href*=\"prod_list/5-\"],\n.gnb__menu a[href*=\"prod_list/10-\"],\n.gnb__menu a[href*=\"prod_list/4-\"],\n.gnb__menu a[href*=\"prod_list_agency\"],\n.gnb__menu a[href*=\"btob\"],\n.menu__gsnb a[href*=\"prod_list/7-1273\"],\n.menu__gsnb a[href*=\"prod_list/7-1332\"],\n.menu__gsnb li:has(> a[href*=\"prod_list/7-1273\"]),\n.menu__gsnb li:has(> a[href*=\"prod_list/7-1332\"]),\n.category__wrap a[href*=\"prod_list/11-\"],\n.category__wrap a[href*=\"prod_list/5-\"],\n.category__wrap a[href*=\"prod_list/10-\"],\n.category__wrap a[href*=\"prod_list/4-\"],\n.category__wrap a[href*=\"prod_list_agency\"],\n.category__wrap a[href*=\"btob\"] {\n  display: none !important;\n}\nli.gnb__menu:has(> a[href*=\"prod_list/11-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/5-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/10-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list/4-\"]),\nli.gnb__menu:has(> a[href*=\"prod_list_agency\"]),\nli.gnb__menu:has(> a[href*=\"btob\"]) {\n  display: none !important;\n}\n\n/* Center align GNB top menu bar */\nul.new-gnb {\n  justify-content: center !important;\n}\n\n/* Center align mobile/category bar */\n.category__wrap {\n  display: flex !important;\n  justify-content: center !important;\n  gap: 10px 20px !important;\n  flex-wrap: wrap !important;\n  padding: 10px 0 !important;\n}\n.category__wrap a {\n  line-height: 1.5 !important;\n}\n\n/* Change 이벤트/기획전 button color to match logo blue */\na.right__event[href*=\"display\"] p {\n  background-color: #0838f8 !important;\n}\n\n/* Cart badge circle */\n.cart__count {\n  background-color: #0838f8 !important;\n}\n\n/* Dropdown submenu background */\n.all__depth2 {\n  background-color: #0838f8 !important;\n}\n\n/* 이벤트/기획전 바로가기 inline button */\na[href*=\"display\"][style*=\"ff3700\"] {\n  background-color: #0838f8 !important;\n}\n\n/* 제휴카드 할인가 label and sale price text (only fee2, not fee) */\n.fee2 .label,\n.fee2 .price.sale,\n.fee2 .price.sale strong {\n  color: #0838f8 !important;\n}\n\n/* Headset icon - no filter needed, it's already dark */\n\n/* Category hover color - override all orange hover rules */\n.gnb__menu a:hover,\n.gnb__menu:hover > a,\n.new-gnb .gnb__menu > a:hover,\n.new-gnb .gnb__menu > a.active,\n.category__wrap a:hover,\nli.gnb__menu:hover,\nli.gnb__menu:hover > a,\n.all_cate > li > a:hover,\n.all_cate > li > a:focus,\n.new-gnb .gnb__all .all__menu .all__depth3 a:hover,\n.w_gnb4 .w_dp02 > .on > a,\n.w_gnb4 .w_dp03 a:hover,\n.pc_gnb4 .p_dp2 > .on > a {\n  color: #0838f8 !important;\n}\n\n/* Active depth1 background */\n.new-gnb .gnb__all .all__menu .all__depth1 a.active {\n  background-color: #0838f8 !important;\n}\n\n/* Slider dots handled by global .slick-dots rule below */\n\n/* Active border top */\n.active .gsnb_box {\n  border-top-color: #0838f8 !important;\n}\n.active > .gsnb_3dep_box {\n  border-top-color: #0838f8 !important;\n}\n\n/* Mobile category hover */\n.pc.m_cate li a:hover {\n  background-color: #0838f8 !important;\n}\n\n/* 간편 실시간 문의 button */\n.quick .org a {\n  background-color: #0838f8 !important;\n}\n\n/* Replace q_call icons with blue versions */\nimg[src*=\"q_call.png\"] {\n  content: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAACXBIWXMAAAPoAAAD6AG1e1JrAAAEhklEQVR4nN2aX1NTRxTAM+3sHftk+yGWQPgWtF8B2lHfa1/qo/rQFvravjtOx2G6xZoqaVWqFOtMpxa1JICVqrS1lIkY5E8MBMQIc++eztndJJdLwrh/EjK5MzvA5e4553f33LPn7G7MHzwSc9QOEcp6CGWfEsqShLJpQlmOULZOKAP1M6fuJ9VzPdjPlQ0xSwFvEcqOEsquEcpKymjdVlL9j6K8g4B5m1DWTyhbNQSo11BeP8pvBswbhLIPCWXPHUNEWwH1oL5GwVBC2USDIaJtAvU6hSGU9RLKik0GAdVQb68TGELZSUIZPyAQUA31n7SCIZR9ecAQEGlfGMEQyk61gPFQo53SgiGUvd8CrgX7uFzv68J0Esq2WsBo2KcVa0W5WvOIk/DrJW4AnxsHKBWhcgU+8JXHENwdBEK/tdWR9gePvFkXhlB23Boi/gNA8VkVoFQEvvgAeDYDsJ6r3ke221/ZAn1cD+aw7cwe/P61tHJ7C4L0EHjxVI3nvgEv8TPwpVnxKM/NgBcfNtVZQLv3wBDKTtuA8Nkb0rgnU68/it2/SHh/B0jHBVPdp6MwmL6vGI/IrTMSZG5c3y27rsu+hQVTmNVyGRFOVwyFnZdvd2PZ3D3vnBMivK5RUxl9YZirtt+JF79kDIONry0A7JRM+4+UYQ5ZFFYAmysAm6tWIMLdEmPqpXxv0r+EhV1MlbqGRgzJEJuxnjNElBOypr4zldETUxWj2dvsvKx8/ZoDGCYDwfxd0/79CJOyd42UO5hnj0z7pxDmD/ORuSIMQBdxBvP0vmn/+wizrN2x4yLwv24CbCxJA7IZMasbg3RckPLUxR+NAelI6srJIcy2ruJK8oh518o/yj0eGsN4iZ+kjOdZ4IUnoXlrSEfORkxXMZ+5Kr+TxJgrXxcZdvjb87p/lZFtQk+O9sjwQhaA8133BMziA7AOJJ2XqzJ5AHxhWntktL4ZzKGwLtkDk/vTAcxIVaa/rSszpx3NeH6+STA7wBfuaUezVJvApLQzAFh/2kQ3m9HOALRyM776r5oomcNoJmHCBZrBC+rRzpq9hJrciosQTCUhyMh6BhcqbENzcG8Ygt/OiBERf6eH9LJmVc+MaCnvvglQ2oDK9WoTgnT9lMbr+lHM8Pzh6C5Xqvw/Pgx8+e/d8u6cM6pnEKbP6K2iWwjXOF/3GYSMXrXeeDkD59lJk9GtVprK1VxvHIlREAYuzYp8Dgsvnv9vTxEWjJ+Vz+Xn7dcAfDk6A65hMCjgFb2PbgQv8pW8To5IRjcXA9UGaq2bveN6RwyKmFXzvfdf5CXByzXgc7dtirsC2l1vRfMjlzDl7yWYri52BJNJeW/8rAsdJ5qy1lxxteykdCOMZo9vyd/FzG5d0GX2XWtut12AmHK3D1p8f6ZPd+fskxYwHKx3ztpuT9Nvt91mv93OAfi7T2ikmwySdn5CIzIPHVdnWxoJsYZ6Gnl2JnqqaaBBp5o+D6cozYAJnzc7RigbtdgWeaX6Hzuo82axOmDvEso+i5wELAcO/Bk+CYjPvWcLEIb5Hx356NF6wY1zAAAAAElFTkSuQmCC) !important;\n}\nimg[src*=\"q_call_red\"] {\n  content: url(data:image/png;base64,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) !important;\n}\n\n/* Board active title */\n.board--style01 > li.active .board__tit .tit__param01 {\n  color: #0838f8 !important;\n}\n\n/* Month selector - keep original gray, blue on hover */\n.month > div a.month_box {\n  background-color: rgb(191, 190, 188) !important;\n}\n.month > div:hover a.month_box,\n.month > div.on a.month_box {\n  background-color: #0838f8 !important;\n}\n\n/* === Product Detail Page === */\n\n/* 렌탈(소유권이전) text */\n.dh_orange {\n  color: #0838f8 !important;\n}\n\n/* 카드할인가 box */\n.box.org {\n  background-color: #0838f8 !important;\n}\n\n/* 제휴카드안내 button */\na[href=\"javascript:\"]:has-text(\"제휴카드\") {\n  background-color: #0838f8 !important;\n}\n\n/* 렌탈신청 / 렌탈신청하기 button */\nbutton.plain.ok,\n.plain.ok {\n  background-color: #0838f8 !important;\n}\n\n/* 카드할인가 price in table */\ntd.red.card_dc b {\n  color: #0838f8 !important;\n}\n\n/* 간편 실시간 문의 popup title */\n.call_tit {\n  background-color: #0838f8 !important;\n}\n\n/* 주문혜택 text */\n.intro__param03 {\n  color: #0838f8 !important;\n}\n\n/* Slider dot - only active one is blue */\n.slick-dots li button {\n  background: rgb(191, 190, 188) !important;\n}\n.slick-dots li.slick-active button {\n  background: #0838f8 !important;\n}\n\n/* Hide 9353658f banner image */\nimg[src*=\"9353658f65d55314184dbf6824f6b68e\"] {\n  display: none !important;\n}\n\n#livePriceTable.lpt-empty { display: none !important; }\n\n/* Center product detail content */\n.prod_view_detail {\n  max-width: 1100px !important;\n  margin: 0 auto !important;\n  padding-right: 0 !important;\n}\n/* Hide rental comparison card (replaced by price table) */\n.prod_view_bot.card {\n  display: none !important;\n}\n\n/* === Product List Page === */\n\n/* Sidebar filter count numbers (inline style override) */\nlabel span[style*=\"dd5119\"] {\n  color: #0838f8 !important;\n}\n\n/* === Benefit Section === */\n\n/* 주문혜택 benefit intro text */\n.intro__param02 {\n  color: #0838f8 !important;\n}\n\n/* Benefit active card border/accent */\n.cs__benefit .slick-active,\n.cs__benefit .slick-current {\n  border-color: #0838f8 !important;\n}\n\n/* Benefit popup number highlight */\n.cs__popup .number {\n  color: #0838f8 !important;\n}\n\n/* Replace 자가관리 badge icon */\nimg[src*=\"482e20b9860dcd908c01baf733cbfec2\"] {\n  content: url(data:image/png;base64,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) !important;\n}\n\n/* === Mobile specific === */\n\n/* Active category text and underline */\n.category__wrap a.on,\n.mobile__gnb a.on,\n.gnb__cateogry a.on {\n  color: #0838f8 !important;\n  border-bottom-color: #0838f8 !important;\n}\n\n/* Active subcategory - blue bg, white text */\n.pc.m_cate li.on,\nli.on,\n.prod_list__cate li.on {\n  background-color: #0838f8 !important;\n  color: #ffffff !important;\n}\n\n/* 검색결과 button */\n.mo_filter_wrap a.ok {\n  background-color: #0838f8 !important;\n}\n\n/* 스마트필터 icon */\n.mo_filter_wrap img[src*=\"mo_filter\"],\nimg[src*=\"mo_filter\"] {\n  filter: hue-rotate(220deg) saturate(3) brightness(0.8) !important;\n}\n\n/* Total count number */\nb.m_total_cnt {\n  color: #0838f8 !important;\n}\n\n/* Dropdown submenu background - white */\n.gnb__menu .menu__gsnb {\n  background-color: #ffffff !important;\n}\n\n/* Replace 방문관리 badge icons */\nimg[src*=\"48b1a4742387bc142eb517efe727f761\"],\nimg[src*=\"bfa152f515994c9358ecd6b0f64b17a3\"] {\n  content: url(data:image/png;base64,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) !important;\n}\n\n/* BEST badge */\n.best-pill {\n  position: absolute !important;\n  top: 12px !important;\n  left: 12px !important;\n  z-index: 50 !important;\n  display: flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  width: 44px !important;\n  height: 22px !important;\n  background: linear-gradient(135deg, #4a7cff, #0838f8) !important;\n  color: #fff !important;\n  font-size: 11px !important;\n  font-weight: 800 !important;\n  letter-spacing: 1px !important;\n  border-radius: 6px !important;\n  line-height: 1 !important;\n  pointer-events: none !important;\n}\n\n/* Management icons bigger on mobile */\n@media (max-width: 768px) {\n  .event img[src*=\"482e20b9860dcd908c01baf733cbfec2\"],\n  .event img[src*=\"48b1a4742387bc142eb517efe727f761\"],\n  .event img[src*=\"bfa152f515994c9358ecd6b0f64b17a3\"] {\n    transform: scale(1.5) translateX(3px) !important;\n    transform-origin: top right !important;\n  }\n  .best-pill {\n    left: 9px !important;\n  }\n\n}\n\n/* === Global orange override === */\n\n/* All elements with inline dd5119 color */\n[style*=\"dd5119\"],\n[style*=\"DD5119\"] {\n  color: #0838f8 !important;\n}\n[style*=\"background-color: #dd5119\"],\n[style*=\"background-color:#dd5119\"],\n[style*=\"background-color: #DD5119\"],\n[style*=\"background-color:#DD5119\"] {\n  background-color: #0838f8 !important;\n}\n\n/* ff7a4c / ff6325 / ff9752 / e8601a inline styles */\n[style*=\"ff7a4c\"], [style*=\"FF7A4C\"],\n[style*=\"ff6325\"], [style*=\"FF6325\"],\n[style*=\"ff9752\"], [style*=\"FF9752\"],\n[style*=\"e8601a\"], [style*=\"E8601A\"] {\n  color: #0838f8 !important;\n}\n\n/* 제휴카드안내 button in rental comparison (exclude month_box) */\n.card a[href=\"javascript:\"]:not(.month_box),\n.rantal_wrap a[href=\"javascript:\"]:not(.month_box) {\n  background-color: #0838f8 !important;\n}\n\n/* Rental card red_small text */\n.red_small,\n.red,\ntd.red {\n  color: #0838f8 !important;\n}\n\n/* 전체보기 button if orange */\n.cs__benefit a {\n  border-color: #0838f8 !important;\n}\n\n/* Product list hover overlay - blue background, white text */\n.prod_list .thumb::before {\n  border-bottom-color: #0838f8 !important;\n}\n.prod_list .thumb::after {\n  color: #ffffff !important;\n}\n.prod_list .go {\n  background: #0838f8 !important;\n}\n\n/* Subcategory hover */\n.prod_list__cate > li:hover {\n  background-color: #0838f8 !important;\n  color: #ffffff !important;\n}\n\n/* Search page colors */\n.search__keyword,\n.search_keyword,\n.search-keyword,\n.keyword,\n.search__tit,\n.search_result .keyword,\n.result__keyword {\n  color: #0838f8 !important;\n}\n.search__count,\n.search_count,\n.result__count,\n.search_result b,\n.search_result strong {\n  color: #0838f8 !important;\n}\n.search__line,\n.search_line,\n.search__tit,\n.search-page hr,\n.search_result {\n  border-color: #0838f8 !important;\n}\n[style*=\"color: #dd5119\"],\n[style*=\"color:#dd5119\"],\n[style*=\"color: #e65100\"],\n[style*=\"color:#e65100\"],\n[style*=\"color: #ff6600\"],\n[style*=\"color:#ff6600\"],\n[style*=\"color: rgb(221, 81, 25)\"],\n[style*=\"border-bottom: 2px solid #dd5119\"],\n[style*=\"border-bottom: 2px solid rgb(221, 81, 25)\"] {\n  color: #0838f8 !important;\n  border-color: #0838f8 !important;\n}\n\n/* === Order page orange → blue === */\n.btn_large.c1,\nbutton.plain.btn_large.c1 {\n  background-color: #0838f8 !important;\n}\nem.dh_red,\n.dh_red {\n  color: #0838f8 !important;\n}\nh3.part_tit,\n.order-field,\n.cart-list {\n  border-top-color: #0838f8 !important;\n}\n.red_box {\n  border-top-color: #0838f8 !important;\n}\ntd.red.card_dc,\ntd.red.card_dc a,\ntd.red.card_dc b,\n.card_dc,\n.card_dc a {\n  color: #0838f8 !important;\n}\n\n\n/* === Combined Month + Payment Section === */\n\n.prod_view_bot.card .card__top {\n  background: #f8f9ff !important;\n  border: none !important;\n  border-radius: 12px 12px 0 0 !important;\n  padding: 16px 20px !important;\n  margin-bottom: 0 !important;\n}\n.prod_view_bot.card .card__top p {\n  font-size: 14px !important;\n  color: #333 !important;\n}\n.prod_view_bot.card .card__top span {\n  color: #0838f8 !important;\n  font-weight: 700 !important;\n}\n\n.month {\n  display: flex !important;\n  gap: 8px !important;\n  flex-wrap: wrap !important;\n  padding: 12px 0 !important;\n}\n.month > div {\n  flex: 1 !important;\n  min-width: 120px !important;\n}\n.month > div a.month_box {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 14px 10px !important;\n  border-radius: 10px !important;\n  border: 2px solid #e0e0e0 !important;\n  background: #fff !important;\n  transition: all 0.2s ease !important;\n  text-decoration: none !important;\n  height: auto !important;\n}\n.month > div a.month_box:hover {\n  border-color: #0838f8 !important;\n  background: #f0f3ff !important;\n}\n.month > div.on a.month_box {\n  border-color: #0838f8 !important;\n  background: #0838f8 !important;\n  color: #fff !important;\n  box-shadow: 0 4px 12px rgba(8, 56, 248, 0.3) !important;\n}\n.month > div.on a.month_box p {\n  color: #fff !important;\n}\n.month > div a.month_box p.fz14 {\n  font-size: 12px !important;\n  color: #888 !important;\n  margin-bottom: 4px !important;\n}\n.month > div a.month_box p.fz16 {\n  font-size: 15px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n}\n.month > div.on a.month_box p.fz14,\n.month > div.on a.month_box p.fz16 {\n  color: #fff !important;\n}\n\n.month_click {\n  display: none !important;\n}\n.fix_price.hide-767 {\n  display: flex !important;\n}\n\n/* === Sticky Bottom Bar v4 === */\n#billyjo-bottom-bar {\n  position: fixed !important;\n  bottom: 0 !important;\n  left: 0 !important;\n  right: 0 !important;\n  z-index: 9999 !important;\n  background: #fff !important;\n  border-top: 1px solid #e0e0e0 !important;\n  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08) !important;\n  padding: 0 !important;\n  transform: translateY(100%) !important;\n  transition: transform 0.3s ease !important;\n}\n#billyjo-bottom-bar.show {\n  transform: translateY(0) !important;\n}\n\n#billyjo-bottom-bar .bb-inner {\n  max-width: 1200px !important;\n  margin: 0 auto !important;\n  display: flex !important;\n  align-items: stretch !important;\n  padding: 18px 28px !important;\n  gap: 0 !important;\n}\n\n/* Left column: name + month pills */\n#billyjo-bottom-bar .bb-left {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: center !important;\n  gap: 12px !important;\n  flex: 1 !important;\n  min-width: 0 !important;\n  padding-right: 28px !important;\n}\n#billyjo-bottom-bar .bb-product-name {\n  font-size: 16px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n  white-space: nowrap !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n}\n#billyjo-bottom-bar .bb-months {\n  display: flex !important;\n  gap: 8px !important;\n  overflow-x: auto !important;\n  -webkit-overflow-scrolling: touch !important;\n  scrollbar-width: none !important;\n}\n#billyjo-bottom-bar .bb-months::-webkit-scrollbar {\n  display: none !important;\n}\n#billyjo-bottom-bar .bb-month-pill {\n  display: flex !important;\n  flex-direction: column !important;\n  align-items: center !important;\n  justify-content: center !important;\n  padding: 8px 20px !important;\n  border-radius: 8px !important;\n  border: 1.5px solid #d0d0d0 !important;\n  background: #f5f5f5 !important;\n  cursor: pointer !important;\n  transition: all 0.2s ease !important;\n  white-space: nowrap !important;\n  flex-shrink: 0 !important;\n  min-width: 110px !important;\n  text-align: center !important;\n}\n#billyjo-bottom-bar .bb-month-pill:hover {\n  border-color: #0838f8 !important;\n  background: #f0f3ff !important;\n}\n#billyjo-bottom-bar .bb-month-pill.active {\n  border-color: #0838f8 !important;\n  background: #0838f8 !important;\n  box-shadow: 0 2px 8px rgba(8, 56, 248, 0.3) !important;\n}\n#billyjo-bottom-bar .bb-month-period {\n  font-size: 11px !important;\n  color: #777 !important;\n  line-height: 1.4 !important;\n}\n#billyjo-bottom-bar .bb-month-price {\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  color: #222 !important;\n  line-height: 1.4 !important;\n}\n#billyjo-bottom-bar .bb-month-pill.active .bb-month-period,\n#billyjo-bottom-bar .bb-month-pill.active .bb-month-price {\n  color: #fff !important;\n}\n\n/* Right column: option+buttons top, price bottom */\n#billyjo-bottom-bar .bb-right {\n  display: flex !important;\n  flex-direction: column !important;\n  justify-content: center !important;\n  gap: 14px !important;\n  flex-shrink: 0 !important;\n  padding-left: 28px !important;\n  min-width: 360px !important;\n}\n#billyjo-bottom-bar .bb-right-top {\n  display: flex !important;\n  align-items: center !important;\n  gap: 10px !important;\n}\n#billyjo-bottom-bar .bb-option-select {\n  padding: 10px 12px !important;\n  border: 1px solid #ddd !important;\n  border-radius: 8px !important;\n  font-size: 13px !important;\n  background: #fff !important;\n  color: #555 !important;\n  flex: 1 !important;\n  min-width: 120px !important;\n  cursor: pointer !important;\n}\n#billyjo-bottom-bar .bb-btn {\n  display: inline-flex !important;\n  align-items: center !important;\n  justify-content: center !important;\n  gap: 6px !important;\n  padding: 10px 22px !important;\n  border-radius: 8px !important;\n  font-size: 14px !important;\n  font-weight: 700 !important;\n  cursor: pointer !important;\n  border: none !important;\n  white-space: nowrap !important;\n  transition: all 0.2s ease !important;\n}\n#billyjo-bottom-bar .bb-btn-cart {\n  background: #fff !important;\n  color: #0838f8 !important;\n  border: 2px solid #0838f8 !important;\n}\n#billyjo-bottom-bar .bb-btn-cart:hover {\n  background: #f0f3ff !important;\n}\n#billyjo-bottom-bar .bb-btn-rent {\n  background: #0838f8 !important;\n  color: #fff !important;\n}\n#billyjo-bottom-bar .bb-btn-rent:hover {\n  background: #0626c0 !important;\n}\n#billyjo-bottom-bar .bb-btn-rent svg {\n  width: 16px !important;\n  height: 16px !important;\n  fill: #fff !important;\n}\n\n/* Right bottom: price row */\n#billyjo-bottom-bar .bb-right-bottom {\n  display: flex !important;\n  align-items: center !important;\n  justify-content: flex-end !important;\n  gap: 12px !important;\n  margin-top: 4px !important;\n}\n#billyjo-bottom-bar .bb-price-label {\n  font-size: 14px !important;\n  color: #222 !important;\n  white-space: nowrap !important;\n}\n#billyjo-bottom-bar .bb-card-toggle {\n  display: flex !important;\n  gap: 6px !important;\n  margin-bottom: 8px !important;\n}\n#billyjo-bottom-bar .bb-card-btn {\n  padding: 5px 14px !important;\n  border-radius: 6px !important;\n  border: 1.5px solid #d0d0d0 !important;\n  background: #f5f5f5 !important;\n  color: #666 !important;\n  font-size: 12px !important;\n  font-weight: 600 !important;\n  cursor: pointer !important;\n  transition: all 0.2s ease !important;\n}\n#billyjo-bottom-bar .bb-card-btn.active {\n  background: #0838f8 !important;\n  border-color: #0838f8 !important;\n  color: #fff !important;\n}\n#billyjo-bottom-bar .bb-price {\n  display: inline-block !important;\n  min-width: 140px !important;\n  text-align: center !important;\n  padding: 6px 16px !important;\n  border: none !important;\n  border-radius: 0 !important;\n  font-size: 22px !important;\n  font-weight: 800 !important;\n  white-space: nowrap !important;\n  color: #999 !important;\n  background: #fff !important;\n}\n#billyjo-bottom-bar:not(.no-selection) .bb-price {\n  color: #0838f8 !important;\n  background: #fff !important;\n}\n\n/* Mobile responsive */\n@media (max-width: 767px) {\n  #billyjo-bottom-bar .bb-inner {\n    flex-direction: column !important;\n    padding: 12px 16px 14px !important;\n    gap: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-left {\n    padding-right: 0 !important;\n    border-right: none !important;\n    border-bottom: 1px solid #e0e0e0 !important;\n    padding-bottom: 10px !important;\n    gap: 8px !important;\n  }\n  #billyjo-bottom-bar .bb-product-name {\n    font-size: 14px !important;\n  }\n  #billyjo-bottom-bar .bb-right {\n    padding-left: 0 !important;\n    min-width: 0 !important;\n    gap: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-right-top {\n    flex-wrap: wrap !important;\n  }\n  #billyjo-bottom-bar .bb-option-select {\n    flex: 1 1 100% !important;\n  }\n  #billyjo-bottom-bar .bb-btn {\n    flex: 1 !important;\n    padding: 12px 16px !important;\n    font-size: 13px !important;\n  }\n  #billyjo-bottom-bar .bb-month-pill {\n    min-width: 80px !important;\n    padding: 6px 14px !important;\n  }\n  #billyjo-bottom-bar .bb-month-period {\n    font-size: 10px !important;\n  }\n  #billyjo-bottom-bar .bb-month-price {\n    font-size: 12px !important;\n  }\n  #billyjo-bottom-bar .bb-price {\n    font-size: 18px !important;\n  }\n\n  .prod_fix_wrap.prod_fix_m {\n    display: none !important;\n  }\n\n  .month > div {\n    min-width: calc(50% - 4px) !important;\n    flex: 0 0 calc(50% - 4px) !important;\n  }\n}\n\nbody:has(#billyjo-bottom-bar.show) {\n  padding-bottom: 130px !important;\n}\n\n/* Hide old sticky bars */\n.prod_fix_wrap.prod_fix,\n.prod_fix_wrap.prod_fix_m {\n  display: none !important;\n}\n\n/* Push quick consultation button above bottom bar */\n.new-qb {\n  transition: bottom 0.3s ease !important;\n}\nbody:has(#billyjo-bottom-bar.show) .new-qb {\n  bottom: 140px !important;\n}\n\n/* Hide mobile header until JS redesign runs */\n@media (max-width: 768px) {\n  header:not(.bj-ready) { opacity: 0 !important; }\n  header.bj-ready { opacity: 1 !important; transition: opacity 0.2s ease !important; }\n}\n";
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // === JavaScript ===
  // --- Script block 1 ---

// Immediately hide product image and text on 국산차 detail page to prevent flash
if (location.pathname.indexOf('prod_view/2509') !== -1) {
  var imgHide = document.createElement('style');
  imgHide.id = 'img-hide';
  imgHide.textContent = '.prod_img_big img, .prod_img_small img, .slick-slide img { opacity: 0 !important; } .prod_name b, .model_name small, .fix_tit, .prod_fix_m .title { opacity: 0 !important; }';
  document.head.appendChild(imgHide);
}
// Hide filter sidebar on 신차렌트 pages
if (location.pathname.indexOf('prod_list/7-') !== -1) {
  var filterHide = document.createElement('style');
  filterHide.textContent = '.prod_list__filter { display: none !important; } .prod_list__wrap { padding-left: 0 !important; }';
  document.head.appendChild(filterHide);
}
// Immediately hide product list on 신차렌트 to prevent flash
if (location.pathname.indexOf('prod_list/7-') !== -1) {
  var hideStyle = document.createElement('style');
  hideStyle.id = 'car-hide';
  hideStyle.textContent = '.prod_list { opacity: 0 !important; transition: opacity 0.3s; }';
  document.head.appendChild(hideStyle);
}
document.addEventListener('DOMContentLoaded', function() {
  // Mobile header redesign (ajd.co.kr style)
  if (window.innerWidth <= 768) {
    var iconList = document.querySelector('ul.inline_wrap.header_m_icon');
    var headerEl = document.querySelector('header');
    if (iconList && headerEl) {
      // 1. Extract event banner link, create full-width top bar
      var eventLi = iconList.querySelector('li:first-child');
      var eventLink = eventLi ? eventLi.querySelector('a') : null;
      if (eventLink && eventLink.textContent.indexOf('이벤트') !== -1) {
        var banner = document.createElement('div');
        banner.id = 'bj-top-banner';
        banner.innerHTML = '<a href="' + eventLink.href + '">' + eventLink.textContent.trim() + '</a>';
        headerEl.insertBefore(banner, headerEl.firstChild);
        // Remove event LI entirely from DOM
        eventLi.remove();
      }

      // 2. Move remaining icons (search, cart) into header__top
      var headerTop = document.querySelector('.header__top');
      if (headerTop) {
        iconList.id = 'bj-header-icons';
        headerTop.appendChild(iconList);
      }
    }

    // 3. Inject mobile header CSS
    var mobileHeaderCSS = document.createElement('style');
    mobileHeaderCSS.textContent = [
      '/* Full-width event banner */',
      '#bj-top-banner { background: #0838f8; text-align: center; padding: 8px 16px; transition: transform 0.3s ease, opacity 0.3s ease; }',
      '#bj-top-banner a { color: #fff; font-size: 13px; font-weight: 700; text-decoration: none; letter-spacing: 0.3px; }',
      '',
      '/* Compact header row */',
      'header .wide-inner { padding: 0 16px !important; margin: 0 !important; width: 100% !important; box-sizing: border-box !important; transition: transform 0.3s ease, opacity 0.3s ease; }',
      '.header__top { display: flex !important; align-items: center !important; height: 50px !important; padding: 0 !important; gap: 0 !important; position: relative !important; }',
      '.gnb__hamburger { position: static !important; flex-shrink: 0 !important; width: auto !important; height: auto !important; display: flex !important; align-items: center !important; padding: 0 12px 0 0 !important; float: none !important; }',
      '.gnb__hamburger img { width: 22px !important; height: auto !important; }',
      'a.logo { position: absolute !important; left: 50% !important; transform: translateX(-50%) !important; flex-shrink: 0 !important; width: auto !important; height: auto !important; margin: 0 !important; float: none !important; display: inline-block !important; }',
      'a.logo img { width: 80px !important; height: auto !important; }',
      '#bj-header-icons { position: static !important; display: flex !important; align-items: center !important; gap: 18px !important; margin-left: auto !important; padding: 0 !important; list-style: none !important; flex-shrink: 0 !important; float: none !important; z-index: 1 !important; }',
      '#bj-header-icons li { display: flex !important; align-items: center !important; padding: 0 !important; margin: 0 !important; }',
      '#bj-header-icons img { width: 22px !important; height: 22px !important; }',
      '',
      '/* Category nav */',
      '.category__wrap { padding: 8px 12px !important; gap: 8px 16px !important; border-top: 1px solid #eee; }',
      '',
      '/* Fixed scroll bar (cloned) */',
      '#bj-scroll-header { position: fixed !important; top: 0; left: 0; right: 0; z-index: 9998; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); opacity: 0; pointer-events: none; transition: opacity 0.25s ease; }',
      '#bj-scroll-header.show { opacity: 1; pointer-events: auto; }',
      '#bj-scroll-header .bj-sh-logo { display: none; align-items: center; height: 50px; padding: 0 16px; position: relative; }',
      '#bj-scroll-header.with-logo .bj-sh-logo { display: flex; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-hamburger { width: 22px; height: auto; flex-shrink: 0; margin-right: 12px; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-logo-img { position: absolute; left: 50%; transform: translateX(-50%); width: 80px; height: auto; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-icons { display: flex; gap: 18px; margin-left: auto; }',
      '#bj-scroll-header .bj-sh-logo .bj-sh-icons img { width: 22px; height: 22px; }',
      '#bj-scroll-header .bj-sh-cat { display: flex; justify-content: center; gap: 8px 16px; flex-wrap: wrap; padding: 8px 12px; border-top: 1px solid #eee; }',
      '#bj-scroll-header .bj-sh-cat a { font-size: 14px; color: #333; text-decoration: none; line-height: 1.5; }',
      '#bj-scroll-header .bj-sh-cat a:hover { color: #0838f8; }',
      'header.bj-hide-banner #bj-top-banner { display: none !important; }',
      '/* Disable original site fix class on mobile */',
      'header.fix { position: relative !important; top: auto !important; }',
    ].join('\n');
    document.head.appendChild(mobileHeaderCSS);

    // Reveal header after redesign
    var hdr = document.querySelector('header');
    if (hdr) hdr.classList.add('bj-ready');

    // 4. Build fixed scroll header (separate from original header)
    var scrollHeader = document.createElement('div');
    scrollHeader.id = 'bj-scroll-header';

    // Logo row
    var shLogo = document.createElement('div');
    shLogo.className = 'bj-sh-logo';
    shLogo.innerHTML = '<img class="bj-sh-hamburger" src="https://billyjo.kr/image/common/m_menu.png">'
      + '<img class="bj-sh-logo-img" src="' + (document.querySelector('a.logo img') ? document.querySelector('a.logo img').src : '') + '">'
      + '<div class="bj-sh-icons"><a href="javascript:void(0)"><img src="https://billyjo.kr/image/common/search_icon.png"></a><a href="/html/order/cart"><img src="https://billyjo.kr/image/common/cart_icon.png"></a></div>';
    shLogo.querySelector('.bj-sh-hamburger').addEventListener('click', function() {
      var orig = document.querySelector('.gnb__hamburger');
      if (orig) orig.click();
    });
    scrollHeader.appendChild(shLogo);

    // Category row (clone links from original)
    var shCat = document.createElement('div');
    shCat.className = 'bj-sh-cat';
    var origCats = document.querySelectorAll('.category__wrap > a');
    origCats.forEach(function(a) {
      if (getComputedStyle(a).display !== 'none') {
        var clone = document.createElement('a');
        clone.href = a.href;
        clone.textContent = a.textContent;
        shCat.appendChild(clone);
      }
    });
    scrollHeader.appendChild(shCat);
    document.body.appendChild(scrollHeader);

    // 5. Scroll behavior
    var isMainPage = location.pathname === '/' || location.pathname === '/index.php' || location.pathname === '';
    var lastScrollY = window.scrollY;
    var headerHeight = hdr.offsetHeight;

    if (!isMainPage) {
      hdr.classList.add('bj-hide-banner');
    }

    window.addEventListener('scroll', function() {
      var currentY = window.scrollY;
      var delta = currentY - lastScrollY;

      if (isMainPage) {
        // Main: scroll past header → show fixed category only
        if (currentY > headerHeight) {
          scrollHeader.classList.add('show');
          scrollHeader.classList.remove('with-logo');
        } else {
          scrollHeader.classList.remove('show');
        }
      } else {
        // Sub: scroll down → hide all, scroll up → show logo+category
        if (currentY <= headerHeight) {
          scrollHeader.classList.remove('show');
        } else if (delta > 5) {
          scrollHeader.classList.remove('show');
        } else if (delta < -5) {
          scrollHeader.classList.add('show');
          scrollHeader.classList.add('with-logo');
        }
      }
      lastScrollY = currentY;
    }, { passive: true });
  }

  // Replace LG구독 with LG 케어+ and 현대렌탈케어 with 현대큐밍
  document.querySelectorAll('label').forEach(function(el) {
    el.childNodes.forEach(function(node) {
      if (node.nodeType === 3 && node.textContent.includes('LG구독')) {
        var span = document.createElement('span');
        span.innerHTML = node.textContent.replace('LG구독', 'LG 케어<sup style="font-size:1.3em">+</sup>');
        node.parentNode.replaceChild(span, node);
      }
      if (node.nodeType === 3 && node.textContent.includes('현대렌탈케어')) {
        node.textContent = node.textContent.replace(/현대렌탈케어/g, '현대큐밍');
      }
    });
  });

  // === 신차렌트 category ===
  if (location.pathname.indexOf('prod_list/7-') !== -1) {
    // Hide product count text and 저신용, 타이어 subcategory tabs
    var countEl = document.querySelector('p.cnt');
    if (countEl) countEl.style.display = 'none';
    document.querySelectorAll('.prod_list__cate li').forEach(function(li) {
      var oc = li.getAttribute('onclick') || '';
      if (oc.indexOf('7-1273') !== -1 || oc.indexOf('7-1332') !== -1) li.style.display = 'none';
    });
    function isCarAllowed(text) {
      var t = text.toLowerCase();
      // 캐스퍼 - always show
      if (t.indexOf('캐스퍼') !== -1) return true;
      // 기타 국산차 / 수입차 - always show
      if (t.indexOf('기타 국산차') !== -1 || t.indexOf('수입차') !== -1) return true;
      // K5 - only 하이브리드
      if (t.indexOf('k5') !== -1) return t.indexOf('하이브리드') !== -1;
      // 제네시스 - show G70 (as G80) and GV60 (as 르노 그랑 콜레오스)
      if (t.indexOf('제네시스') !== -1) return t.indexOf('g70') !== -1 || t.indexOf('gv60') !== -1;
      // 펠리세이드/팰리세이드 - hide 디젤
      if (t.indexOf('펠리세이드') !== -1 || t.indexOf('팰리세이드') !== -1) return t.indexOf('디젤') === -1;
      // everything else - hide
      return false;
    }
    var carFilterInterval = setInterval(function() {
      var prodListEl = document.querySelector('.prod_list');
      if (!prodListEl) return;
      var thumbs = prodListEl.querySelectorAll('.thumb');
      if (thumbs.length === 0) return;
      // For each thumb, find the card element (direct child of .prod_list)
      function getCardEl(thumb) {
        var el = thumb;
        while (el && el.parentElement !== prodListEl) { el = el.parentElement; }
        return el;
      }
      // Hide disallowed cards
      var allCards = [];
      thumbs.forEach(function(thumb) {
        var cardEl = getCardEl(thumb);
        if (!cardEl) return;
        if (allCards.indexOf(cardEl) !== -1) return;
        allCards.push(cardEl);
        var text = cardEl.textContent || '';
        if (!isCarAllowed(text)) {
          cardEl.style.display = 'none';
        }
      });
      // Reorder visible cards
      var order = ['기타 국산차', '캐스퍼', 'k5', '제네시스', 'gv60', '펠리세이드', '팰리세이드'];
      var visible = allCards.filter(function(c) { return c.style.display !== 'none'; });
      visible.sort(function(a, b) {
        var tA = (a.textContent || '').toLowerCase();
        var tB = (b.textContent || '').toLowerCase();
        var iA = order.length, iB = order.length;
        for (var oi = 0; oi < order.length; oi++) {
          if (tA.indexOf(order[oi].toLowerCase()) !== -1 && oi < iA) iA = oi;
          if (tB.indexOf(order[oi].toLowerCase()) !== -1 && oi < iB) iB = oi;
        }
        return iA - iB;
      });
      visible.forEach(function(c) { prodListEl.appendChild(c); });
      // Rename cards (images already replaced via admin addon)
      allCards.forEach(function(card) {
        var txt = card.textContent || '';
        if (card.style.display === 'none') return;
        // 기타 국산차 → 국산차
        if (txt.indexOf('기타 국산차') !== -1) {
          card.querySelectorAll('p.brand, p.name').forEach(function(el) { el.textContent = el.textContent.replace('기타 국산차', '국산차'); });
        }
        // 캐스퍼
        if (txt.indexOf('캐스퍼') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '현대자동차 캐스퍼'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '캐스퍼 인스퍼레이션'; });
        }
        // K5
        if (txt.indexOf('K5') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '기아자동차 K5'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = 'K5 2.0 하이브리드 베스트 셀렉션'; });
        }
        // G70 → G80
        if (txt.indexOf('G70') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '제네시스 G80'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = 'G80 2.5T 스포츠'; });
        }
        // GV60 → 르노 그랑 콜레오스
        if (txt.indexOf('GV60') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '르노 그랑 콜레오스'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '그랑 콜레오스 1.3 터보 아이코닉'; });
          card.querySelectorAll('strong').forEach(function(el) { el.textContent = '견적신청'; });
          var kImg = card.querySelector('.thumb img');
          if (kImg) { kImg.src = 'https://rentalshop.site/_data/file/goodsImages/c854ac32e496147c9552cdf0b0994749.jpg'; kImg.alt = '르노 그랑 콜레오스'; }
        }
        // 팰리세이드
        if (txt.indexOf('팰리세이드') !== -1) {
          card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = '현대자동차 팰리세이드'; });
          card.querySelectorAll('p.name').forEach(function(el) { el.textContent = '팰리세이드 3.8 익스클루시브 7인승'; });
        }
        // Link all cards to 국산차 page (only on 7-591)
        if (location.pathname.indexOf('7-591') !== -1) {
          card.querySelectorAll('a').forEach(function(a) {
            if (a.href.indexOf('prod_view') !== -1 || a.href === 'javascript:void(0)') {
              a.href = '/html/dh_prod/prod_view/2509';
            }
          });
        }
      });
      // Hide pagination
      var pager = document.querySelector('.board-pager');
      if (pager) pager.style.display = 'none';
      // Show product list after filtering
      var hs = document.getElementById('car-hide');
      if (hs) { hs.textContent = '.prod_list { opacity: 1 !important; transition: opacity 0.3s; }'; }
      clearInterval(carFilterInterval);
    }, 500);
    setTimeout(function() {
      clearInterval(carFilterInterval);
      var hs = document.getElementById('car-hide');
      if (hs) hs.remove();
    }, 30000);
  }

  // === 수입차 page: create 5 import car cards ===
  if (location.pathname.indexOf('7-596') !== -1) {
    var importInterval = setInterval(function() {
      var prodListEl = document.querySelector('.prod_list');
      if (!prodListEl) return;
      var origCard = prodListEl.querySelector('.thumb') ? prodListEl.children[0] : null;
      if (!origCard) return;
      clearInterval(importInterval);
      var impBase = 'https://rentalshop.site/_data/file/goodsImages/';
      var importCars = [
        { brand: '테슬라 모델 Y', name: '모델 Y 롱레인지 AWD', img: impBase + '652866adbe7893ff257e1e0e80374727.jpg' },
        { brand: 'BMW 5시리즈', name: '520i M 스포츠', img: impBase + 'b996fde34864677ee57c6a7250a5f1a9.jpg' },
        { brand: 'BMW X3', name: 'X3 xDrive20i M 스포츠', img: impBase + '4a8fdc8e42922c94ebdb0d243ef8c99c.jpg' },
        { brand: '메르세데스-벤츠 E-클래스', name: 'E 300 4MATIC AMG 라인', img: impBase + '787adc6e1c29651fa9e3e889745c46eb.jpg' },
        { brand: '메르세데스-벤츠 GLC', name: 'GLC 300 4MATIC AMG 라인', img: impBase + '2c999daf715aaf4a2a3ea42a8dbb2423.jpg' }
      ];
      importCars.forEach(function(car) {
        var card = origCard.cloneNode(true);
        card.querySelectorAll('p.brand').forEach(function(el) { el.textContent = car.brand; });
        card.querySelectorAll('p.name').forEach(function(el) { el.textContent = car.name; });
        card.querySelectorAll('strong').forEach(function(el) { el.textContent = '견적신청'; });
        if (car.img) { var ci = card.querySelector('.thumb img'); if (ci) ci.src = car.img; }
        if (car.img) { var ci = card.querySelector('.thumb img'); if (ci) ci.src = car.img; }
        var link = card.querySelector('a');
        if (link) link.href = '/html/dh_prod/prod_view/3586';
        prodListEl.appendChild(card);
      });
      // Replace first card (수입차) thumbnail
      var origImg = origCard.querySelector('.thumb img');
      if (origImg) origImg.src = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
      origCard.querySelectorAll('a').forEach(function(a) { a.href = '/html/dh_prod/prod_view/3586'; });
      var pager = document.querySelector('.board-pager');
      if (pager) pager.style.display = 'none';
      var hs = document.getElementById('car-hide');
      if (hs) hs.textContent = '.prod_list { opacity: 1 !important; transition: opacity 0.3s; }';
    }, 500);
    setTimeout(function() { clearInterval(importInterval); }, 30000);
  }

  // === BEST badge for top 3 products on list pages ===
  if (location.pathname.indexOf('prod_list') !== -1 && location.pathname.indexOf('7-596') === -1) {
    var bestInterval = setInterval(function() {
      var thumbs = document.querySelectorAll('.prod_list .thumb');
      if (thumbs.length === 0) return;
      var count = Math.min(3, thumbs.length);
      var done = 0;
      for (var i = 0; i < count; i++) {
        if (thumbs[i].querySelector('.best-pill')) { done++; continue; }
        var pill = document.createElement('div');
        pill.className = 'best-pill';
        pill.textContent = 'BEST';
        thumbs[i].style.position = 'relative';
        thumbs[i].appendChild(pill);
        done++;
      }
      if (done >= count) clearInterval(bestInterval);
    }, 500);
    setTimeout(function() { clearInterval(bestInterval); }, 30000);
  }

  // === Global: replace old 기타 국산차 yellow banner with black banner ===
  var gukBannerIds = ['f20a1005c32b110f132da6be0e8ad69e', '7cd7b51b4f8969361aa9b123640176e0', '252b9d5312002f1a50fe6532d4c17eba'];
  var newBanner = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
  document.querySelectorAll('img').forEach(function(img) {
    gukBannerIds.forEach(function(id) { if (img.src.indexOf(id) !== -1) img.src = newBanner; });
  });

  // === 기타 국산차 detail page: match thumbnail ===
  if (location.pathname.indexOf('prod_view/2509') !== -1) {
    var gukImg = 'https://rentalshop.site/_data/file/goodsImages/17aeef731e84ade23d0c907788c9c426.png';
    var gukInterval = setInterval(function() {
      var bigImg = document.querySelector('.prod_img_big img');
      if (!bigImg) return;
      clearInterval(gukInterval);
      document.querySelectorAll('img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1 && img.closest('.prod_img')) img.src = gukImg;
        if (img.src.indexOf('goodsImages') !== -1 && img.closest('.slick-slide')) img.src = gukImg;
      });
      // Rename all 기타 국산차 → 국산차, thin text → 차종 선택 가능
      document.title = document.title.replace('기타 국산차', '국산차');
      var nameB = document.querySelector('.prod_name b');
      if (nameB) nameB.textContent = '국산차';
      document.querySelectorAll('.model_name small').forEach(function(el) { el.textContent = '전 차종 선택 가능'; });
      var fixTit = document.querySelector('.fix_tit');
      if (fixTit && fixTit.textContent.indexOf('국산차') !== -1) fixTit.textContent = '국산차';
      var fixM = document.querySelector('.prod_fix_m .title');
      if (fixM && fixM.textContent.indexOf('국산차') !== -1) fixM.textContent = '차량렌트서비스 - 국산차';
      document.querySelectorAll('td').forEach(function(el) {
        if (el.textContent.trim() === '기타국산차' || el.textContent.trim() === '기타 국산차') el.textContent = '국산차';
      });
      // img_wrap 유지 (아래 긴 배너)
      var ih = document.getElementById('img-hide');
      if (ih) ih.textContent = '.prod_img_big img, .prod_img_small img, .slick-slide img, .prod_name b, .model_name small, .fix_tit, .prod_fix_m .title { opacity: 1 !important; transition: opacity 0.3s; }';
    }, 300);
    setTimeout(function() { clearInterval(gukInterval); var ih = document.getElementById('img-hide'); if (ih) ih.remove(); }, 15000);
  }

  // === Order page: 고객메모 → 희망 차량, 기타 국산차 → 국산차 ===
  if (location.pathname.indexOf('dh_order/rental') !== -1) {
    var memoLabel = document.querySelector('label[for="du-msg"]');
    if (memoLabel) memoLabel.textContent = '희망 차량';
    var memoArea = document.getElementById('tx_content');
    if (memoArea) memoArea.placeholder = '원하시는 차량의 브랜드, 모델명, 연식을 적어주세요. (예: 현대 팰리세이드 2025년식)';
    // 기타 국산차 → 국산차
    document.querySelectorAll('td, th, a, span, p, b, strong').forEach(function(el) {
      if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3 && el.textContent.indexOf('기타 국산차') !== -1) {
        el.textContent = el.textContent.replace('기타 국산차', '국산차');
      }
    });
  }

  // === 수입차 detail page: image + thin font ===
  if (location.pathname.indexOf('prod_view/3586') !== -1) {
    var impDetailInterval = setInterval(function() {
      var bigImg = document.querySelector('.prod_img_big img');
      if (!bigImg) return;
      clearInterval(impDetailInterval);
      document.querySelectorAll('.model_name small').forEach(function(el) { el.textContent = '전 차종 선택 가능'; });
      document.querySelectorAll('.prod_img img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = newBanner;
      });
      document.querySelectorAll('.slick-slide img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = newBanner;
      });
    }, 300);
    setTimeout(function() { clearInterval(impDetailInterval); }, 15000);
  }

  // === 캐스퍼 detail page: remove EV references ===
  if (location.pathname.indexOf('prod_view/23613') !== -1) {
    var casperInterval = setInterval(function() {
      var nameB = document.querySelector('.prod_name b');
      if (!nameB) return;
      clearInterval(casperInterval);
      nameB.textContent = '현대자동차 캐스퍼';
      var modelSmall = document.querySelector('.model_name small');
      if (modelSmall) modelSmall.textContent = '캐스퍼 인스퍼레이션';
      document.title = document.title.replace('캐스퍼EV (EV) 전기차', '캐스퍼 인스퍼레이션');
      // Replace product image with addon thumbnail
      var casperImg = 'https://rentalshop.site/_data/file/goodsImages/b3fb834e9ecd833593e67c816ad8d0ec.jpg';
      document.querySelectorAll('.prod_img img').forEach(function(img) {
        if (img.src.indexOf('goodsImages') !== -1) img.src = casperImg;
      });
    }, 300);
    setTimeout(function() { clearInterval(casperInterval); }, 15000);
  }

  // === Live Price Table (product detail pages only, skip 신차렌트 products) ===
  // Reorder 인기 카테고리: 정수기, 공기청정기, 에어컨 first
  var priorityOrder = ['정수기', '공기청정기', '에어컨'];
  document.querySelectorAll('ul.new-mc__list').forEach(function(ul) {
    var items = Array.from(ul.children);
    var priority = [];
    var rest = [];
    priorityOrder.forEach(function(name) {
      items.forEach(function(li) {
        if (li.textContent.trim() === name && priority.indexOf(li) === -1) priority.push(li);
      });
    });
    items.forEach(function(li) { if (priority.indexOf(li) === -1) rest.push(li); });
    priority.concat(rest).forEach(function(li) { ul.appendChild(li); });
  });

  var carProdIds = ['2509','23613','2493','2337','9213','2345'];
  var isCarProd = carProdIds.some(function(id) { return location.pathname.indexOf('prod_view/' + id) !== -1; });
  if (location.pathname.indexOf('prod_view') !== -1 && !isCarProd) {
    // Only show price table for 정수기 products
    var prodNameEl = document.querySelector('.prod_name b');
    var prodNameText = prodNameEl ? prodNameEl.textContent : '';
    var isJeongsugi = prodNameText.indexOf('정수기') !== -1;
    if (!isJeongsugi) { /* skip price table for non-정수기 */ }
    else {
    var modelEl = document.querySelector('.model_name small');
    if (modelEl) {
      var fullModelText = modelEl.textContent.trim();
      var firstWord = fullModelText.split(' ')[0];
      var isModelCode = /[A-Z].*[0-9]/.test(firstWord) || /[0-9].*[A-Z]/.test(firstWord);
      var siteName = fullModelText;

      // Only hide the specific pricing table image (3192f27b)
      document.querySelectorAll('.img_wrap img').forEach(function(img) {
        if (img.src.indexOf('3192f27b') !== -1) img.style.display = 'none';
      });

      var targetImg = null;
      document.querySelectorAll('.img_wrap img').forEach(function(img) {
        if (img.src.indexOf('3192f27b') !== -1) targetImg = img;
      });

      // Create table container
      var tw = document.createElement('div');
      tw.id = 'livePriceTable';
      tw.innerHTML = '<div style="max-width:1100px;margin:20px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)"><div id="lptTitle" style="background:#0838f8;color:#fff;text-align:center;padding:14px 20px;font-size:15px;font-weight:700;border-bottom:1px solid #eee">로딩 중...</div><table id="lptTable" style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th data-col="0" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">모델명</th><th data-col="1" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">관리유형</th><th data-col="2" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">약정기간</th><th data-col="3" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">관리주기</th><th data-col="4" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">프로모션</th><th data-col="5" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600;border-right:1px solid #eee">이달의 할인가</th><th data-col="6" style="background:#0838f8;color:#fff;padding:12px 8px;text-align:center;font-weight:600">최종 할인가</th></tr></thead><tbody id="lptBody"><tr><td colspan="7" style="text-align:center;padding:30px;color:#999">데이터 로딩 중...</td></tr></tbody></table></div>';

      // Insert where the old image was
      if (targetImg) {
        targetImg.parentNode.insertBefore(tw, targetImg);
      } else {
        var iw = document.querySelector('.img_wrap');
        if (iw) iw.parentElement.insertBefore(tw, iw);
      }

      // Fetch mapping sheet first, then price data
      var MAP_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=2102926561&single=true&output=csv';
      var PRICE_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=644793625&single=true&output=csv';
      var CHUNGHO_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=872567753&single=true&output=csv';
      var LG_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=940661926&single=true&output=csv';
      var CUKU_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=713090459&single=true&output=csv';
      var CUMING_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=1642392826&single=true&output=csv';
      var SK_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=72673581&single=true&output=csv';
      var LUHENS_URL='https://docs.google.com/spreadsheets/d/e/2PACX-1vSkILMb-8t9BG6u4HWbJ9yeVTxhFU-puHsoiJi2tGEJUMZt7ddmXvwDXnM7HC0UGQ/pub?gid=1353739758&single=true&output=csv';

      function parseCSVSimple(text){
        var rows=[],cur=[],fld='',inQ=false;
        for(var i=0;i<text.length;i++){
          var c=text.charAt(i);
          if(c==='"'){if(inQ&&text.charAt(i+1)==='"'){fld+='"';i++}else{inQ=!inQ}}
          else if(c===','&&!inQ){cur.push(fld.trim());fld=''}
          else if(c.charCodeAt(0)===10&&!inQ){cur.push(fld.trim());rows.push(cur);cur=[];fld=''}
          else if(c.charCodeAt(0)!==13){fld+=c}
        }
        if(fld||cur.length){cur.push(fld.trim());rows.push(cur)}
        return rows;
      }

      // Step 1: Fetch mapping
      fetch(MAP_URL).then(function(r){return r.text()}).then(function(mapText){
        var mapRows=parseCSVSimple(mapText);
        var modelText='';

        // Always try mapping first
        for(var mi=1;mi<mapRows.length;mi++){
          if(mapRows[mi][0]&&siteName.indexOf(mapRows[mi][0])!==-1){
            modelText=mapRows[mi][1];break;
          }
          if(mapRows[mi][0]&&mapRows[mi][0].indexOf(siteName)!==-1){
            modelText=mapRows[mi][1];break;
          }
        }
        // If no mapping found, use model code
        if(!modelText&&isModelCode){modelText=firstWord.replace(/_[가-힣0-9].*/,'')}
        if(!modelText){var fb=[['아이콘 냉온정수기 2.0','CHP-7211N'],['아이콘 냉정수기 2.0','CP-7211N']];for(var fi=0;fi<fb.length;fi++){if(siteName.indexOf(fb[fi][0])!==-1){modelText=fb[fi][1];break}}}

        if(!modelText){
          document.getElementById('livePriceTable').classList.add('lpt-empty');
          return;
        }

        // Step 2: Fetch price data (코웨이 + 청호나이스)
        return Promise.all([fetch(PRICE_URL).then(function(r){return r.text()}),fetch(CHUNGHO_URL).then(function(r){return r.text()}),fetch(LG_URL).then(function(r){return r.text()}),fetch(CUKU_URL).then(function(r){return r.text()}),fetch(CUMING_URL).then(function(r){return r.text()}),fetch(SK_URL).then(function(r){return r.text()}),fetch(LUHENS_URL).then(function(r){return r.text()})]).then(function(results){
        var NL=String.fromCharCode(10);var text=results.join(NL);
        var rows=parseCSVSimple(text);

        var hIdx=-1;
        for(var j=0;j<rows.length;j++){if(rows[j][0]==='제품군'){hIdx=j;break}}
        if(hIdx===-1){document.getElementById('livePriceTable').classList.add('lpt-empty');return}

        var cm='',cmk='',fil=[];
        for(var k=hIdx+1;k<rows.length;k++){
          var r=rows[k];if(!r||r.length<10||!r[3])continue;
          if(r[2])cm=r[2];if(r[1])cmk=r[1];
          var cmU=cm.toUpperCase(),mtU=modelText.toUpperCase();
          var exact=cmU.indexOf(mtU)!==-1||mtU.indexOf(cmU)!==-1;
          if(!exact){var cmB=cmU.replace(/[(/].*/,''),mtB=mtU.replace(/[(/].*/,'');if(cmB!==mtB)continue;}
          var cy=r[6]||'',pm=(r[4]||'').trim();
          var dP=parseFloat((r[8]||'').replace(/[^0-9.-]/g,''))||0;
          var tP=parseFloat((r[9]||'').replace(/[^0-9.-]/g,''))||0;
          var nP=parseFloat((r[7]||'').replace(/[^0-9.-]/g,''))||0;
          var td2='',cd=cy;
          if(cy==='자가관리'||cy.indexOf('필터')!==-1||cy.indexOf('서비스프리')!==-1){td2='자가관리';cd=cy==='자가관리'?'12개월 필터발송':cy}
          else if(cy.indexOf('M')!==-1){td2='방문관리';cd=cy.replace('M','')+'개월 방문'}
          else{td2=cy}
          var useP=dP||nP;var ps=r[3]+'년의무';
          var isNonCoway=cm.match(/^W[IPDUH]/)||cm.match(/^CP-/)||cm.match(/^CBT-/)||cm.match(/^P-/)||cm.match(/^HQP/)||cm.match(/^HQPM/)||cm.match(/^WPU/);
          if(isNonCoway&&pm.indexOf('반값')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:Math.round(useP/2)});
          } else if(isNonCoway){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:useP});
          } else if(pm.indexOf('반값')!==-1&&pm.indexOf('타사보상')!==-1&&tP>0){
            var hm=pm.match(/(d+개월)s*반값할인/);var hp=hm?hm[1]+'반값할인':'반값할인';
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:hp,dp:useP,fp:Math.round(useP/2)});
            fil.push({m:cm,mk:cmk,t:td2,p:ps+' 타사보상',c:cd,pm:'1년간 렌탈료 1만원 할인',dp:tP,fp:tP-10000});
          } else if(pm.indexOf('반값')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:Math.round(useP/2)});
          } else if(tP>0&&pm.indexOf('타사보상')!==-1){
            fil.push({m:cm,mk:cmk,t:td2,p:ps+' 타사보상',c:cd,pm:pm,dp:tP,fp:tP-10000});
          } else {
            fil.push({m:cm,mk:cmk,t:td2,p:ps,c:cd,pm:pm,dp:useP,fp:useP});
          }
        }

        // Filter out rows without price numbers
        fil=fil.filter(function(r){return r.dp>0||r.fp>0});
        if(!fil.length){document.getElementById('livePriceTable').classList.add('lpt-empty');return}
        document.getElementById('lptTitle').textContent=fil[0].mk;

        // Sort: 방문관리 first, then 자가관리
        var visit=fil.filter(function(r){return r.t==='방문관리'});
        var self2=fil.filter(function(r){return r.t!=='방문관리'});
        fil=visit.concat(self2);

        var tps={};fil.forEach(function(r){if(!tps[r.t])tps[r.t]=[];tps[r.t].push(r)});
        var tb=document.getElementById('lptBody');tb.innerHTML='';
        var tot=fil.length,mD=false,isF=true;
        var s='padding:10px 8px;text-align:center;vertical-align:middle;border-bottom:1px solid #eee;border-right:1px solid #eee;cursor:pointer;';
        var fpr=function(n){return n>0?n.toLocaleString()+'원':'-'};

        Object.keys(tps).forEach(function(tn){
          var tr2=tps[tn],tD=false;
          tr2.forEach(function(rw,ri){
            var tr=document.createElement('tr');
            if(ri===0&&!isF)tr.style.borderTop='2px solid #0838f8';
            var h='';
            if(!mD){h+='<td data-col="0" rowspan="'+tot+'" style="'+s+'font-weight:700;background:#f0f3ff;font-size:14px">'+rw.m+'</td>';mD=true}
            if(!tD){var tc2='color:#666;';h+='<td data-col="1" rowspan="'+tr2.length+'" style="'+s+'font-weight:600;'+tc2+'">'+tn+'</td>';tD=true}
            h+='<td data-col="2" style="'+s+'">'+rw.p+'</td>';
            h+='<td data-col="3" style="'+s+'">'+rw.c+'</td>';
            h+='<td data-col="4" style="'+s+'font-size:11px;color:#888">'+rw.pm+'</td>';
            var promoAmt=0;var pmNum=rw.pm.match(/([0-9]+)원/);if(pmNum)promoAmt=parseInt(pmNum[1]);
            h+='<td data-col="5" style="'+s+'color:#e53935;font-weight:700;font-size:14px">'+fpr(rw.dp>0?rw.dp+promoAmt:0)+'</td>';
            h+='<td data-col="6" style="'+s+'color:#0838f8;font-weight:700;font-size:15px;border-right:none">'+fpr(rw.fp)+'</td>';
            tr.innerHTML=h;tb.appendChild(tr)
          });isF=false
        });

        var aT=null;
        var lptTbl=document.getElementById('lptTable');

        // Hover effect
        lptTbl.addEventListener('mouseover',function(e){
          var td=e.target.closest('td');if(!td||aT)return;
          var ci=td.dataset.col,tr=td.closest('tr');
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
          tr.classList.add('lpt-hrow');
          if(ci)lptTbl.querySelectorAll('td[data-col="'+ci+'"]').forEach(function(c){c.classList.add('lpt-hcol')});
        });
        lptTbl.addEventListener('mouseout',function(e){
          if(aT)return;
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
        });

        // Click effect
        lptTbl.addEventListener('click',function(e){
          var td=e.target.closest('td');if(!td)return;
          lptTbl.querySelectorAll('td,th').forEach(function(el){el.style.removeProperty('background');el.style.removeProperty('color')});
          lptTbl.querySelectorAll('.lpt-hrow').forEach(function(el){el.classList.remove('lpt-hrow')});
          lptTbl.querySelectorAll('.lpt-hcol').forEach(function(el){el.classList.remove('lpt-hcol')});
          if(aT===td){aT=null;return}
          aT=td;var ci=td.dataset.col,tr=td.closest('tr');
          tr.querySelectorAll('td').forEach(function(c){c.style.background='#e8edff'});
          if(ci)lptTbl.querySelectorAll('td[data-col="'+ci+'"]').forEach(function(c){c.style.background='#e8edff'});
          td.style.background='#0838f8';td.style.color='#fff'
        });

        // Inject hover styles
        var hStyle=document.createElement('style');
        hStyle.textContent='#lptTable .lpt-hrow td{background:#f0f3ff !important}#lptTable .lpt-hcol{background:#f0f3ff !important}#lptTable .lpt-hrow .lpt-hcol{background:#dde3ff !important}';
        document.head.appendChild(hStyle);
      })})
      .catch(function(err){
        document.getElementById('livePriceTable').classList.add('lpt-empty');
      });
    }
  } // end isJeongsugi
  }
});


  // --- Script block 2 ---

// === Combined Bottom Bar v4 - 2x2 grid layout ===
if (location.pathname.indexOf('prod_view') !== -1) {
  (function initBottomBar() {
    var bbInterval = setInterval(function() {
      var monthBoxes = document.querySelectorAll('.month_box');
      var prodName = document.querySelector('.prod_name b');
      if (monthBoxes.length === 0 || !prodName) return;
      clearInterval(bbInterval);

      var productName = prodName.textContent.trim();
      var supName = '';
      var nameEl = document.querySelector('.rantal_wrap .name');
      if (nameEl) supName = nameEl.textContent.trim();

      var hasOptions = document.querySelectorAll('.option_select option').length > 1;
      var optionHtml = '';
      if (hasOptions) {
        var originalSelect = document.querySelector('.option_select');
        var options = originalSelect ? originalSelect.innerHTML : '<option value="">옵션 없음</option>';
        optionHtml = '<select class="bb-option-select" onchange="option_selec(this.value)">' + options + '</select>';
      }

      var monthPillsHtml = '';
      monthBoxes.forEach(function(mb, idx) {
        var period = mb.getAttribute('data-month') || '';
        var price = mb.getAttribute('data-price') || '';
        var monthKey = mb.getAttribute('data-month_key') || '';
        monthPillsHtml +=
          '<div class="bb-month-pill" data-idx="' + idx + '" data-month-key="' + monthKey + '">' +
            '<span class="bb-month-period">' + period + '</span>' +
            '<span class="bb-month-price">월 ' + price + '원</span>' +
          '</div>';
      });

      // Check if any month has card discount
      var hasCardDc = false;
      monthBoxes.forEach(function(mb) {
        var dc = mb.getAttribute('data-dcprice') || '0';
        if (dc !== '0' && dc !== '') hasCardDc = true;
      });
      var cardToggleHtml = hasCardDc ?
        '<div class="bb-card-toggle">' +
          '<button class="bb-card-btn active" data-mode="normal">일반</button>' +
          '<button class="bb-card-btn" data-mode="card">카드할인</button>' +
        '</div>' : '';

      var bar = document.createElement('div');
      bar.id = 'billyjo-bottom-bar';
      bar.className = 'no-selection';
      bar.innerHTML =
        '<div class="bb-inner">' +
          '<div class="bb-left">' +
            '<div class="bb-product-name">' + supName + ' - ' + productName + '</div>' +
            cardToggleHtml +
            '<div class="bb-months">' + monthPillsHtml + '</div>' +
          '</div>' +
          '<div class="bb-right">' +
            '<div class="bb-right-top">' +
              optionHtml +
              '<button type="button" class="bb-btn bb-btn-cart" onclick="shoporder(\'cart\')">장바구니</button>' +
              '<button type="button" class="bb-btn bb-btn-rent" onclick="shoporder(\'rent\')">' +
                '<svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
                '렌탈 신청' +
              '</button>' +
            '</div>' +
            '<div class="bb-right-bottom">' +
              '<span class="bb-price-label">월 렌탈료</span>' +
              '<span class="bb-price" id="bb-price">-</span>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(bar);

      var bbPills = bar.querySelectorAll('.bb-month-pill');
      bbPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
          var idx = parseInt(pill.getAttribute('data-idx'));
          monthBoxes[idx].click();
        });
      });

      var cardMode = false;

      // Card toggle handler
      var cardBtns = bar.querySelectorAll('.bb-card-btn');
      cardBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          cardBtns.forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          cardMode = btn.getAttribute('data-mode') === 'card';
          updatePillPrices();
          syncBottomBar();
        });
      });

      function updatePillPrices() {
        bbPills.forEach(function(pill) {
          var idx = parseInt(pill.getAttribute('data-idx'));
          var mb = monthBoxes[idx];
          var p = cardMode ? (mb.getAttribute('data-dcprice') || '0') : (mb.getAttribute('data-price') || '');
          if (cardMode && (p === '0' || p === '')) p = mb.getAttribute('data-price') || '';
          pill.querySelector('.bb-month-price').textContent = '월 ' + p + '원';
        });
      }

      function syncBottomBar() {
        var activeMonth = document.querySelector('.month > div.on a.month_box');
        bbPills.forEach(function(p) { p.classList.remove('active'); });
        if (activeMonth) {
          var activeKey = activeMonth.getAttribute('data-month_key');
          bbPills.forEach(function(p) {
            if (p.getAttribute('data-month-key') === activeKey) p.classList.add('active');
          });
          var price = cardMode ? (activeMonth.getAttribute('data-dcprice') || '0') : activeMonth.getAttribute('data-price');
          if (cardMode && (price === '0' || price === '')) price = activeMonth.getAttribute('data-price');
          bar.classList.remove('no-selection');
          document.getElementById('bb-price').textContent = '₩' + price + '원';
        } else {
          bar.classList.add('no-selection');
          document.getElementById('bb-price').textContent = '-';
        }
      }

      monthBoxes.forEach(function(mb) {
        mb.addEventListener('click', function() {
          setTimeout(syncBottomBar, 100);
        });
      });

      var cardSection = document.querySelector('.prod_view_bot.card');
      function checkScroll() {
        if (!cardSection) { bar.classList.add('show'); return; }
        var rect = cardSection.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          bar.classList.add('show');
        }
      }
      window.addEventListener('scroll', checkScroll);
      setTimeout(checkScroll, 500);

      if (hasOptions) {
        var bbSelect = bar.querySelector('.bb-option-select');
        document.querySelectorAll('.option_select').forEach(function(sel) {
          sel.addEventListener('change', function() {
            if (bbSelect) bbSelect.value = this.value;
          });
        });
        if (bbSelect) {
          bbSelect.addEventListener('change', function() {
            document.querySelectorAll('.option_select').forEach(function(sel) {
              sel.value = bbSelect.value;
            });
          });
        }
      }

      syncBottomBar();
    }, 500);
    setTimeout(function() { clearInterval(bbInterval); }, 30000);
  })();
}


})();
