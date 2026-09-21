import { Navigate, Route, Routes } from 'react-router-dom';
import Present from './pages/Present';
import Join from './pages/Join';
import HomeWorkspace from './components/HomeWorkspace';
import TellOverview from './pages/product/TellOverview';
import TellStories from './pages/product/TellStories';
import TellConnect from './pages/product/TellConnect';
import TellCalendar from './pages/product/TellCalendar';
import TellQuotes from './pages/product/TellQuotes';
import StoryReview from './pages/product/StoryReview';
import CreateStory from './pages/product/CreateStory';
import QuoteAction from './pages/product/QuoteAction';
import RaiseOverview from './pages/product/RaiseOverview';
import KresgeOpportunityDetail from './pages/product/KresgeOpportunityDetail';
import CampaignAction from './pages/product/CampaignAction';
import ManageOverview from './pages/product/ManageOverview';
import ManageAssets from './pages/product/ManageAssets';
import NextSteps from './pages/product/NextSteps';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/present/PC26" replace />} />

      {/* Presenter Shell Route (Default Session PC26) */}
      <Route path="/present" element={<Present />}>
        <Route index element={<HomeWorkspace />} />
        <Route path="tell" element={<TellOverview />} />
        <Route path="tell/stories" element={<TellStories />} />
        <Route path="tell/stories/create" element={<CreateStory />} />
        <Route path="tell/stories/review" element={<StoryReview />} />
        <Route path="tell/connect" element={<TellConnect />} />
        <Route path="tell/calendar" element={<TellCalendar />} />
        <Route path="tell/quotes" element={<TellQuotes />} />
        <Route path="tell/quotes/:channel" element={<QuoteAction />} />
        <Route path="raise" element={<RaiseOverview />} />
        <Route path="raise/opportunities/kresge" element={<KresgeOpportunityDetail />} />
        <Route path="raise/:action" element={<CampaignAction />} />
        <Route path="manage" element={<ManageOverview />} />
        <Route path="manage/assets" element={<ManageAssets />} />
        <Route path="next-steps" element={<NextSteps />} />
      </Route>

      {/* Presenter Shell Route with Dynamic Session Context */}
      <Route path="/present/:sessionId" element={<Present />}>
        <Route index element={<HomeWorkspace />} />
        <Route path="tell" element={<TellOverview />} />
        <Route path="tell/stories" element={<TellStories />} />
        <Route path="tell/stories/create" element={<CreateStory />} />
        <Route path="tell/stories/review" element={<StoryReview />} />
        <Route path="tell/connect" element={<TellConnect />} />
        <Route path="tell/calendar" element={<TellCalendar />} />
        <Route path="tell/quotes" element={<TellQuotes />} />
        <Route path="tell/quotes/:channel" element={<QuoteAction />} />
        <Route path="raise" element={<RaiseOverview />} />
        <Route path="raise/opportunities/kresge" element={<KresgeOpportunityDetail />} />
        <Route path="raise/:action" element={<CampaignAction />} />
        <Route path="manage" element={<ManageOverview />} />
        <Route path="manage/assets" element={<ManageAssets />} />
        <Route path="next-steps" element={<NextSteps />} />
      </Route>

      {/* Audience Participant Views */}
      <Route path="/join" element={<Navigate to="/join/PC26" replace />} />
      <Route path="/join/:sessionId" element={<Join />} />

      <Route path="*" element={<Navigate to="/present/PC26" replace />} />
    </Routes>
  );
}