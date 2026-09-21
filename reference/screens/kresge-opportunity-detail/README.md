# PosterChild Master Screen Reference: Kresge Opportunity Detail

**Route:** `/present/:sessionId/raise/opportunities/kresge`  
**Mission:** `kresge-funding`  
**Decision:** `kresge-next-action`  
**Options:** Review requirements, Strengthen application, Ask Postie

---

## 1. Role as Opportunity Detail Reference

This reference documents the definitive visual and structural specification for the Kresge Foundation Opportunity Detail screen within the Raise pillar.

Key specifications implemented:
1. **Header Row:**
   - Title: `Kresge Foundation` in Fraunces 36px/44px, 600 weight
   - Subtitle: `Youth Career Pathways Initiative • $150,000 USD • 92% Alignment Match` in DM Sans 16px secondary
   - Utility actions: Bookmark icon button, Share button, More (ellipsis) icon button
2. **Funder Summary Card:**
   - 16px radius, white surface, subtle 1px border (`#E5E5E5`), 20px padding
   - Left: Rectangular match block (~90px wide, 2px green border, 12px radius, "Match", "92%", "Excellent" compact green badge)
   - Center: 3 metric columns (Funding Range `$250K - $500K`, Application Deadline `Nov 11, 2026`, Avg. Grant `~$350K`), Fraunces 24px values
   - Category tags: Compact blue badges (`Recommended`, `Mission Aligned`, `Human Services`, `Economic Mobility`, `Private Foundation`, `National (US)`)
   - Actions: `Review requirements` (primary gold, arrow-up-right), `Strengthen application` (secondary), `Ask Postie` (secondary, sparkles)
3. **Horizontal Tabs:**
   - Profile (active, gold underline), Action Plan, One-Pager, LOI, Pathway, Contacts, Grants [1]
4. **Funding Alignment Card:**
   - 12px radius bordered card with 5 weighted criteria rows and horizontal progress bars:
     - Mission: 60 (30%)
     - Programmatic: 72 (25%)
     - Financial: 78 (20%)
     - Relationship: 38 (15%)
     - Geographic: 42 (10%)
5. **Funder Overview:**
   - Long-form card with: Their Mission (expanding equity and opportunity in America’s cities), Where They Give (US national, place-based in Detroit, Memphis, New Orleans, Fresno), Who They Support (nonprofit/community orgs advancing mobility), Funding Priorities (8 city & human services priorities), Core Values (Equity, Opportunity, Community, Collaboration, Systems Change, Racial Justice), About the Funder (Founded 1924 by Sebastian Spering Kresge).
6. **Postie Configuration:**
   - Context label: `Raise`
   - Active conversation pre-populated with:
     - User: "Which funding opportunity should I focus on first?"
     - Postie: "I’d start with Kresge. Your Youth Career Pathways work aligns well with Kresge’s focus on economic mobility, equity, and opportunity for people with low incomes. You already have strong participant stories and impact evidence. The main readiness gap is the workforce program budget, last updated in 2025."
