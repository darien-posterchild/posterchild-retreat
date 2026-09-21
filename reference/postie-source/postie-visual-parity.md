# Postie Visual Parity & Style Translation Audit

This document performs an exhaustive, element-by-element comparison between the authoritative Postie prototype source (`https://github.com/darien-posterchild/postie.git`, specifically `src/components/layout/postie-panel.tsx`) and the current retreat implementation. It documents why styles were previously degraded and provides the exact CSS/token translations required for 100% visual parity.

---

## 1. Root Cause Analysis: Why Styles Were Lost in the Initial Port

1. **Tailwind-to-Vanilla Class Name Mismatch**: The retreat project doesn't run Tailwind CSS; it uses scoped Vanilla CSS (`src/styles.css`). In the initial port, many Tailwind utility classes (`p-[16px_12px_16px_16px]`, `rounded-[12px]`, `shadow-[0_1px_2px_rgba(0,0,0,0.05)]`, `inset 0px -2px 0px rgba(0,0,0,0.05)`) were replaced with generic custom classes that didn't retain the exact inset bevel shadows, border colors, and padding.
2. **Metadata Flex Layout Missing in Messages**: In `postie-panel.tsx`, the message header row is an explicit `<div className="w-full h-[20px] flex items-center justify-between">`. The user name ("You") is on the left and the timestamp ("Just now") is on the right. In the initial retreat pass, metadata was placed in an inline block, causing "YouJust now" to concatenate visually without horizontal separation.
3. **Browser Default Button & Input Reset Omissions**: Several buttons (`.pc-ref-postie-chats-btn`, `.pc-ref-postie-icon-btn`, `.pc-ref-postie-action-pill`, `.pc-ref-context-add-btn`) did not have explicit `appearance: none; border: 0; outline: none; background: transparent; font-family: inherit;`, leading the browser to render native beveled button borders or system fonts.
4. **Action Buttons Inside Postie Responses**: The action pills (e.g. "Open story", "Rewrite intro") in `postie-panel.tsx` use a specific skeuomorphic card button: `h-[30px] px-2.5 py-1.5 gap-1 bg-[#FFFFFF] border border-[#D4D4D4] hover:border-[#A3A3A3] hover:bg-[#F9FAFB] rounded-[8px] font-sans font-semibold text-[12px] leading-[18px] text-[#404040]`. In the retreat, these were rendered as informal pill badges (`border-radius: 9999px; background: #FFF9E8`) which looked like raw chips rather than crisp, interactive action buttons.
5. **Context Bar Structure & Popover Elevation**: The source context bar is a quiet `px-4 pt-2 pb-1 bg-white border-t border-[#F0F0F0]/80` with a clean inline flex row containing an automatic route chip, attached tags, and an orange/gold `+ Add` link (`text-[#8F6500] hover:underline`). The popover picker was missing fixed elevation (`z-50`) and exact border/radius geometry.
6. **Presenter Dock Collision**: `.presenter-dock` was fixed to `bottom: 22px; right: 28px;`, placing it directly on top of the Postie composer controls, floating window, and collapsed launcher.

---

## 2. Element-by-Element Visual Translation Matrix

### A. Top Panel Header

| Component | Source Tailwind / CSS | Current Retreat Value | Missing / Broken Styling | Target CSS Translation |
|---|---|---|---|---|
| **Header Bar** | `h-[72px] p-[16px_12px_16px_16px] bg-white border-b border-[#F0F0F0]/60` | `h: 56px; padding: 10px 14px;` | Height was truncated to 56px; padding was too tight; border was wrong color | `height: 72px; padding: 16px 12px 16px 16px; border-bottom: 1px solid rgba(240, 240, 240, 0.6); box-sizing: border-box;` |
| **Chats Button** | `w-[96px] h-[40px] px-[14px] py-[10px] bg-[#FFFFFF] border border-[#D4D4D4] rounded-[12px] flex items-center justify-between font-sans font-semibold text-[14px] leading-[20px] text-[#404040] hover:bg-[#F9FAFB] shadow-[0px_1px_2px_rgba(0,0,0,0.05),_inset_0px_-2px_0px_rgba(0,0,0,0.05)]` | `padding: 6px 10px; border-radius: 10px; font-size: 13px;` | Inset bottom bevel shadow was missing; width was fluid instead of fixed 96px; radius was 10px instead of 12px | `width: 96px; height: 40px; padding: 10px 14px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 12px; font-size: 14px; font-weight: 600; line-height: 20px; color: #404040; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px -2px 0px rgba(0, 0, 0, 0.05);` |
| **New Chat Button** | `w-[40px] h-[40px] p-[10px] bg-[#FFFFFF] border border-[#D4D4D4] rounded-[12px] flex items-center justify-center hover:bg-[#F9FAFB] shadow-[0px_1px_2px_rgba(0,0,0,0.05),_inset_0px_-2px_0px_rgba(0,0,0,0.05)]` | `padding: 6px; border-radius: 8px; border: 0;` | Rendered as unbordered icon button instead of elevated 40x40 button matching Chats | `width: 40px; height: 40px; padding: 10px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 12px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px -2px 0px rgba(0, 0, 0, 0.05);` |
| **View Selector Trigger** | `w-[40px] h-[40px] p-[10px] rounded-[8px] bg-transparent border-0 text-[#A3A3A3] hover:text-[#171717] hover:bg-[#F5F5F5]` | `padding: 6px; border-radius: 8px;` | Hover state and active background were inconsistent | `width: 40px; height: 40px; padding: 10px; border-radius: 8px; border: 0; background: transparent; color: #A3A3A3;` |
| **View Dropdown Menu** | `w-[177px] h-[122px] py-1 bg-[#FFFFFF] border border-[rgba(0,0,0,0.10)] rounded-[8px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),_0px_4px_6px_-2px_rgba(0,0,0,0.03)] z-50` | `min-width: 170px; border-radius: 10px;` | Size and exact padding did not match 177px x 122px spec | `width: 177px; height: 122px; padding: 4px 0; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.10); border-radius: 8px; box-shadow: 0px 12px 16px -4px rgba(0,0,0,0.08), 0px 4px 6px -2px rgba(0,0,0,0.03); z-index: 50;` |

---

### B. Postie Identity & Conversation Area

| Component | Source Tailwind / CSS | Current Retreat Value | Missing / Broken Styling | Target CSS Translation |
|---|---|---|---|---|
| **Empty State Title** | `font-semibold text-[24px] leading-[32px] text-[#171717] font-fraunces` | `font-size: 15px; font-weight: 650;` | Rendered as small 15px text instead of 24px Fraunces serif headline | `font-family: var(--pc-ref-font-display), Fraunces, Georgia, serif; font-size: 24px; font-weight: 600; line-height: 32px; color: #171717;` |
| **Empty State BETA Badge** | `w-[53px] h-[22px] px-[6px] py-[2px] gap-1 bg-[#F0FDF4] border border-[#BBF7D0] rounded-[6px]` | `font-size: 10px; padding: 1px 6px; border-radius: 9999px;` | Pill shape instead of 6px rounded card with green dot | `width: 53px; height: 22px; padding: 2px 6px; gap: 4px; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 6px; display: inline-flex; align-items: center;` |
| **Starter Prompt Buttons** | `w-full h-[36px] p-2 gap-2 rounded-[8px] font-semibold text-[12px] leading-[18px] bg-[#F5F5F5] border-transparent text-[#535862] hover:bg-[#EAEAEA]` | `padding: 10px 12px; border-radius: 10px; font-size: 12.5px;` | Height was bloated (44px+); wrong border & radius | `width: 100%; height: 36px; padding: 8px; gap: 8px; border-radius: 8px; font-size: 12px; font-weight: 600; line-height: 18px; background: #F5F5F5; border: 1px solid transparent; color: #535862;` |
| **Active Compact Header** | `h-[28px] border-b border-[#F0F0F0]/60 pb-2 mb-1 flex items-center gap-1.5` | `padding: 10px 18px; border-bottom: 1px solid #E5E5E5; background: #FAFAFA;` | Full background bar instead of quiet minimal border line | `height: 28px; border-bottom: 1px solid rgba(240, 240, 240, 0.6); padding-bottom: 8px; margin-bottom: 4px; background: transparent; display: flex; align-items: center; gap: 6px;` |

---

### C. Message Bubbles & Metadata

| Component | Source Tailwind / CSS | Current Retreat Value | Missing / Broken Styling | Target CSS Translation |
|---|---|---|---|---|
| **User Message Header** | `w-full h-[20px] flex items-center justify-between` | Inline block / unaligned | "You" and "Just now" were visually running together | `width: 100%; height: 20px; display: flex; align-items: center; justify-content: space-between;` |
| **User Name ("You")** | `font-medium text-[14px] leading-[20px] text-[#404040]` | Undefined / merged | Hierarchy lost | `font-size: 14px; font-weight: 500; line-height: 20px; color: #404040;` |
| **User Timestamp** | `font-normal text-[12px] leading-[18px] text-[#525252]` | Undefined / merged | Hierarchy lost | `font-size: 12px; font-weight: 400; line-height: 18px; color: #525252;` |
| **User Message Bubble** | `max-w-[320px] px-3 py-2 bg-[#FFFDF5] border border-[#FFCC33] rounded-[8px_0px_8px_8px]` | `border-radius: 14px; border: 1px solid #E5E5E5; background: #FAFAFA;` | Wrong warm tint (`#FFFDF5`), wrong border (`#FFCC33`), wrong asymmetric corner radii | `max-width: 320px; padding: 8px 12px; background: #FFFDF5; border: 1px solid #FFCC33; border-radius: 8px 0px 8px 8px; font-size: 15px; font-weight: 400; line-height: 22px; color: #8F6500;` |
| **Postie Message Header** | `w-full h-[20px] flex items-center justify-between` | Undefined / merged | Copy icon and timestamp spacing broken | `width: 100%; height: 20px; display: flex; align-items: center; justify-content: space-between;` |
| **Postie Message Bubble** | `w-full px-3 py-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-[0px_12px_12px_12px]` | `border-radius: 14px; padding: 10px 14px;` | Asymmetric top-left corner was rounded instead of sharp 0px | `width: 100%; padding: 8px 12px; background: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 0px 12px 12px 12px; font-size: 14px; line-height: 21px; color: #171717;` |
| **Inline Action Buttons** | `h-[30px] px-2.5 py-1.5 gap-1 bg-[#FFFFFF] border border-[#D4D4D4] hover:border-[#A3A3A3] hover:bg-[#F9FAFB] rounded-[8px] font-semibold text-[12px] leading-[18px] text-[#404040]` | `border-radius: 9999px; background: #FFF9E8; font-size: 11.5px;` | Looked like pill badges rather than interactive button controls | `height: 30px; padding: 6px 10px; gap: 4px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; font-size: 12px; font-weight: 600; line-height: 18px; color: #404040; display: inline-flex; align-items: center; cursor: pointer; transition: all 0.15s ease;` |

---

### D. Context Bar & Picker Popover

| Component | Source Tailwind / CSS | Current Retreat Value | Missing / Broken Styling | Target CSS Translation |
|---|---|---|---|---|
| **Context Bar Wrapper** | `w-full px-4 pt-2 pb-1 bg-white border-t border-[#F0F0F0]/80` | `padding: 8px 14px; background: #FAFAFA;` | Background should be crisp white with subtle top border | `width: 100%; padding: 8px 16px 4px 16px; background: #FFFFFF; border-top: 1px solid rgba(240, 240, 240, 0.8); box-sizing: border-box;` |
| **"Context" Label** | `font-semibold text-[12px] leading-[18px] text-[#535862]` | Missing / implicit | Section lacked clear label | `font-size: 12px; font-weight: 600; line-height: 18px; color: #535862;` |
| **Current Page Chip** | `h-[24px] px-2 bg-[#FAFAFA] border border-[#E5E5E5] rounded-[6px] gap-1 font-medium text-[12px] text-[#404040]` | `padding: 3px 8px; font-size: 11px;` | Height and typography mismatch | `height: 24px; padding: 0 8px; background: #FAFAFA; border: 1px solid #E5E5E5; border-radius: 6px; font-size: 12px; font-weight: 500; line-height: 18px; color: #404040; display: inline-flex; align-items: center; gap: 4px;` |
| **Attached Context Chip** | `h-[24px] pl-2 pr-1 bg-[#FFFFFF] border border-[#D4D4D4] rounded-[6px] max-w-[140px] text-[11px]` | `background: #FFF9E8; border: #FFE8A3;` | Used yellow highlight instead of clean white border card | `height: 24px; padding-left: 8px; padding-right: 4px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 6px; font-size: 11px; font-weight: 500; color: #404040; max-width: 140px; display: inline-flex; align-items: center; gap: 4px;` |
| **+ Add Button** | `font-semibold text-[12px] leading-[18px] text-[#8F6500] hover:underline bg-transparent border-none p-0 cursor-pointer` | `border: 1px dashed #D4D4D4; border-radius: 6px; padding: 3px 8px;` | Rendered as a dashed button instead of a clean inline link | `font-size: 12px; font-weight: 600; line-height: 18px; color: #8F6500; background: transparent; border: none; padding: 0; cursor: pointer;` |
| **Upward Context Popover** | `w-[320px] max-w-[calc(100%-16px)] p-2 bg-[#FFFFFF] border border-[#E5E5E5] rounded-[12px] shadow-[0px_12px_16px_-4px_rgba(0,0,0,0.08),_0px_4px_6px_-2px_rgba(0,0,0,0.03)] z-50` | `border-radius: 12px; padding: 10px;` | Padding and shadow elevation mismatch | `width: 320px; max-width: calc(100% - 16px); padding: 8px; background: #FFFFFF; border: 1px solid #E5E5E5; border-radius: 12px; box-shadow: 0px 12px 16px -4px rgba(0, 0, 0, 0.08), 0px 4px 6px -2px rgba(0, 0, 0, 0.03); z-index: 50;` |

---

### E. Composer

| Component | Source Tailwind / CSS | Current Retreat Value | Missing / Broken Styling | Target CSS Translation |
|---|---|---|---|---|
| **Outer Composer Row** | `w-full p-[8px_16px_16px_16px] bg-white` | `padding: 12px 14px 14px;` | Spacing was misaligned | `width: 100%; padding: 8px 16px 16px 16px; background: #FFFFFF; box-sizing: border-box;` |
| **Textarea Container Box** | `w-full max-w-[360px] h-[110px] p-3 bg-[#FFFFFF] border border-[#D4D4D4] rounded-[8px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]` | `background: #FAFAFA; border-radius: 12px; padding: 10px 12px 8px;` | Background was grey instead of crisp white; radius was 12px instead of 8px; height was fluid | `width: 100%; max-width: 360px; height: 110px; padding: 12px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 8px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between;` |
| **Textarea Input** | `font-normal text-[14px] leading-[20px] text-[#171717] placeholder:text-[#737373]` | `font-size: 13px; line-height: 19px;` | Font size was 13px instead of 14px | `font-size: 14px; font-weight: 400; line-height: 20px; color: #171717; resize: none; outline: none; border: none; padding: 0; background: transparent; width: 100%;` |
| **Composer Plus & Settings Buttons** | `w-[36px] h-[36px] p-2 bg-[#FFFFFF] border border-[#D4D4D4] rounded-[12px] hover:bg-[#F9FAFB] shadow-[0px_1px_2px_rgba(0,0,0,0.05),_inset_0px_-2px_0px_rgba(0,0,0,0.05)]` | `padding: 5px; border-radius: 6px; border: 0;` | Rendered as unbordered icon buttons instead of 36x36 card buttons with bevel shadow | `width: 36px; height: 36px; padding: 8px; background: #FFFFFF; border: 1px solid #D4D4D4; border-radius: 12px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px -2px 0px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;` |
| **Microphone Button** | `w-[36px] h-[36px] rounded-[8px] bg-transparent border-0 text-[#A3A3A3] hover:text-[#171717] hover:bg-[#F5F5F5]` | Generic icon | Spacing and hover color | `width: 36px; height: 36px; border-radius: 8px; background: transparent; border: 0; color: #A3A3A3; display: flex; align-items: center; justify-content: center; cursor: pointer;` |
| **Send Button** | `w-[36px] h-[36px] p-2 bg-[#F4B400] rounded-[12px] shadow-[0px_1px_2px_rgba(0,0,0,0.05),_inset_0px_-2px_0px_rgba(0,0,0,0.05)]` | `width: 28px; height: 28px; border-radius: 8px;` | Size was only 28x28 with 8px radius instead of 36x36 with 12px radius; bevel shadow was missing | `width: 36px; height: 36px; padding: 8px; background: #F4B400; border: none; border-radius: 12px; box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05), inset 0px -2px 0px rgba(0, 0, 0, 0.05); display: flex; align-items: center; justify-content: center;` |

---

### F. Collapsed Launcher & Presenter Dock Collision

| Component | Source Tailwind / CSS | Current Retreat Value | Defect | Target Fix |
|---|---|---|---|---|
| **Collapsed Launcher** | `w-[40px] h-[40px] bg-[#FFF9E8] border border-[#FFCC33] rounded-[8.57143px] z-50 fixed right-5 bottom-5 shadow-[0px_20px_24px_-4px_rgba(0,0,0,0.08),_0px_8px_8px_-4px_rgba(0,0,0,0.03),_0px_3px_3px_-1.5px_rgba(0,0,0,0.04)]` | `border: 1px solid var(--pc-ref-border-default); background: #FFFFFF; border-radius: 12px;` | Background was white instead of `#FFF9E8`, border was `#E5E5E5` instead of `#FFCC33`, radius was 12px instead of 8.57px | `width: 40px; height: 40px; background: #FFF9E8; border: 1px solid #FFCC33; border-radius: 8.57px; box-shadow: 0px 20px 24px -4px rgba(0,0,0,0.08), 0px 8px 8px -4px rgba(0,0,0,0.03), 0px 3px 3px -1.5px rgba(0,0,0,0.04); position: fixed; right: 20px; bottom: 20px; z-index: 50;` |
| **Presenter Dock** | `N/A (Retreat presenter chrome)` | `position: fixed; right: 28px; bottom: 22px;` | **Direct collision** with Postie composer send button, floating panel, and launcher | `position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 50;` completely eliminates collision and preserves presenter shortcuts safely |
