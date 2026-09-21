# PosterChild Retreat Decision Graph

This document details the branching decision architecture for the PosterChild Retreat 2026 application. Rather than a linear slide sequence, the retreat functions as an interactive, live-branched product demonstration driven by audience consensus from the participant remote (`/join/:sessionId`).

```mermaid
graph TD
    Home["Home: Good morning, Jayla<br/>/present/:sessionId"]
    Dec1{"Decision: home-focus<br/>What should PosterChild focus on first?"}

    Home --> Dec1

    %% Branch A
    Dec1 -->|"stories (vote)"| StoriesDest["Tell / Stories<br/>/present/:sessionId/tell/stories"]
    StoriesDest --> Dec2A{"Decision: stories-next<br/>Which story should we move forward?"}
    Dec2A -->|"mayas-journey"| StoryReview1["Story Review<br/>/present/:sessionId/tell/stories/review?story=mayas-journey"]
    Dec2A -->|"youth-voices"| StoryReview2["Story Review<br/>/present/:sessionId/tell/stories/review?story=youth-voices"]
    Dec2A -->|"community-gardens"| StoryReview3["Story Review<br/>/present/:sessionId/tell/stories/review?story=community-gardens"]

    %% Branch B
    Dec1 -->|"campaigns (vote)"| CampaignsDest["Raise / Overview<br/>/present/:sessionId/raise"]
    CampaignsDest --> Dec2B{"Decision: campaigns-next<br/>What should we do with the campaign?"}
    Dec2B -->|"launch"| CampLaunch["Launch Campaign<br/>/present/:sessionId/raise/launch"]
    Dec2B -->|"refine"| CampRefine["Refine Storytelling<br/>/present/:sessionId/raise/refine"]
    Dec2B -->|"ask-postie"| CampPostie["Ask Postie Insights<br/>/present/:sessionId/raise/ask-postie"]

    %% Branch C
    Dec1 -->|"quotes (vote)"| QuotesDest["Tell / Quotes<br/>/present/:sessionId/tell/quotes"]
    QuotesDest --> Dec2C{"Decision: quotes-next<br/>Where could this quote create the most value?"}
    Dec2C -->|"story"| QuoteStory["Feature in Story<br/>/present/:sessionId/tell/quotes/story"]
    Dec2C -->|"campaign"| QuoteCamp["Anchor Campaign<br/>/present/:sessionId/tell/quotes/campaign"]
    Dec2C -->|"social"| QuoteSocial["Social Graphics<br/>/present/:sessionId/tell/quotes/social"]

    %% Convergence Node
    StoryReview1 --> FinalNode{"Decision: final-next-step<br/>What should PosterChild do next?"}
    StoryReview2 --> FinalNode
    StoryReview3 --> FinalNode
    CampLaunch --> FinalNode
    CampRefine --> FinalNode
    CampPostie --> FinalNode
    QuoteStory --> FinalNode
    QuoteCamp --> FinalNode
    QuoteSocial --> FinalNode

    FinalNode --> Roadmap["Convergence Roadmap<br/>/present/:sessionId/next-steps"]
```

## Node Manifest

### 1. Root Decision: `home-focus`
- **Question**: "What should PosterChild focus on first?"
- **Context**: Home Dashboard attention cards and metrics.
- **Choices**:
  - `stories` → Destination: `/tell/stories` (Branch A)
  - `campaigns` → Destination: `/raise` (Branch B)
  - `quotes` → Destination: `/tell/quotes` (Branch C)

### 2. Second-Level Decision: `stories-next`
- **Question**: "Which story should we move forward?"
- **Context**: Stories library triage.
- **Choices**:
  - `mayas-journey` → `/tell/stories/review?story=mayas-journey`
  - `youth-voices` → `/tell/stories/review?story=youth-voices`
  - `community-gardens` → `/tell/stories/review?story=community-gardens`

### 3. Second-Level Decision: `campaigns-next`
- **Question**: "What should we do with the campaign?"
- **Context**: Summer Youth Initiative strategy.
- **Choices**:
  - `launch` → `/raise/launch`
  - `refine` → `/raise/refine`
  - `ask-postie` → `/raise/ask-postie`

### 4. Second-Level Decision: `quotes-next`
- **Question**: "Where could this quote create the most value?"
- **Context**: High-resonance community quote activation.
- **Choices**:
  - `story` → `/tell/quotes/story`
  - `campaign` → `/tell/quotes/campaign`
  - `social` → `/tell/quotes/social`

### 5. Convergence Decision: `final-next-step`
- **Question**: "What should PosterChild do next?"
- **Context**: Cross-branch synthesis into active product backlog.
- **Choices**:
  - `publish-all` → `/next-steps?action=publish`
  - `export-campaign` → `/next-steps?action=export`
  - `explore-postie` → `/next-steps?action=postie`
