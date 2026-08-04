import { Routes, Route, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import MainLayout from "../components/layout/MainLayout";
import ProtectedLayout from "../pages/Login.jsx/ProtectiveRoute/ProtectedRoute";
import Home from "../pages/Home";
import Shorts from "../pages/Shorts";
import Trending from "../pages/Trending";
import NotFound from "../pages/NotFound";
import WatchPage from "../components/common/WatchPage";
import WithdrawPage from "../components/common/WithdrawPage";
import UploadVideo from "../pages/UploadVideo/UploadVideoScreen";
import Profile from "../pages/MyProfile";
import ReelPlayerPage from "../components/common/ReelPlayerPage";
import FullVideo from "../pages/UploadVideo/FullVideo";

import AuthPage from "../pages/Login.jsx/AuthPage";
import WatchHistoryTab from "../pages/Settings/WatchHistoryTab";
import LikedVideosTab from "../pages/Settings/LikedVideosTab";
import YourVideosTab from "../pages/Settings/YourVideosTab";
import WatchLaterTab from "../pages/Settings/WatchLaterTab";
import ChannelPage from "../components/channels/ChannelPage";
import ChannelCustomization from "../components/channels/ChannelCustomization";
import Leaderboard from "../pages/Settings/Leaderboard";
import SubscribedChannels from "../pages/UploadVideo/SubscribedChannels";
import ViewAll from "../pages/ViewAll";
import SearchPage from "../pages/SearchPage";

function ViewAllRoute() {
  const { type } = useParams();
  const selectedCategory = useSelector(
    (state) => state.videos.selectedCategory,
  );
  return <ViewAll key={`${type}-${selectedCategory || "all"}`} />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />

      <Route element={<ProtectedLayout />}>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shorts" element={<Shorts />} />
          <Route path="shorts/:id" element={<Shorts />} />
          <Route path="trending" element={<Trending />} />
          <Route path="watch/:id" element={<WatchPage />} />
          <Route path="withdraw" element={<WithdrawPage />} />
          <Route path="uploadvideo" element={<UploadVideo />} />
          <Route path="reel" element={<ReelPlayerPage />} />
          <Route path="videos/:type" element={<ViewAllRoute />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="video/:id" element={<FullVideo />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subscribechannel/:id" element={<SubscribedChannels />} />

          <Route path="/history" element={<WatchHistoryTab />} />
          <Route path="/liked-videos" element={<LikedVideosTab />} />
          <Route path="/watch-later" element={<WatchLaterTab />} />
          <Route path="/your-videos" element={<YourVideosTab />} />
          <Route path ="/leaderboard" element={<Leaderboard/>} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/channel/:id" element={<ChannelPage />} />
          <Route path="/channel/customize" element={<ChannelCustomization />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
