import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Mic,
  MicOff,
  Plus,
  Bell,
  Star,
  User,
  Settings,
  LogOut,
  Wallet,
  History,
  Heart,
  Clock,
  Video,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  FileText,
  MessageCircle,
  PhoneCall,
  ArrowLeft,
  X,
} from "lucide-react";
import { useRewards } from "../../context/RewardContext";
import { useSelector, useDispatch } from "react-redux";
import NotificationPanel from "./NotificationPanel";
import {
  fetchNotifications,
  resetNotifications,
} from "../../features/notifications/notificationsSlice";
import axios from "axios";
import { API_ORIGIN as API_BASE_URL } from "../../config/api";

const HINTS_URL = `${API_BASE_URL}/api/uservideo/search/hints`;

export default function Navbar({ toggleSidebar }) {
  const { points } = useRewards();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unreadCount = useSelector((state) => state.notifications.unreadCount);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token")),
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // ===== SEARCH + VOICE =====
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [hints, setHints] = useState([]);
  const [showHints, setShowHints] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const recognitionRef = useRef(null);
  const searchBoxRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const mobileSearchBoxRef = useRef(null);

  // Search navigate
  const handleSearch = useCallback(
    (query) => {
      const q = (typeof query === "string" ? query : searchQuery).trim();
      if (!q) return;
      setShowHints(false);
      setIsListening(false);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    },
    [searchQuery, navigate],
  );

  // ===== Speech Recognition setup =====
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-IN";

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setSearchQuery(transcript);

      if (event.results[event.results.length - 1].isFinal) {
        const finalQuery = transcript.trim();
        if (finalQuery) {
          // thoda delay taaki UI update ho
          setTimeout(() => {
            navigate(`/search?q=${encodeURIComponent(finalQuery)}`);
            setIsListening(false);
            setShowHints(false);
          }, 300);
        }
      }
    };

    recognition.onerror = (event) => {
      if (event.error === "aborted") {
        setIsListening(false);
        return;
      }
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please allow mic access.");
      }
    };

    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;

    return () => {
      try {
        recognitionRef.current?.abort();
      } catch (_) {}
    };
  }, [navigate]);

  // ===== Fetch hints from backend (typing + voice) =====
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 1) {
      setHints([]);
      setShowHints(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(HINTS_URL, {
          params: { q },
          signal: controller.signal,
        });
        const data = res.data?.data || res.data?.hints || res.data || [];
        setHints(Array.isArray(data) ? data : []);
        setShowHints(true);
      } catch (err) {
        if (axios.isCancel(err) || err?.code === "ERR_CANCELED") return;
        console.error("Hints fetch error:", err);
        setHints([]);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery]);

  // Mic click
  const handleMicClick = () => {
    if (!voiceSupported) {
      alert("Voice search is not supported in this browser. Use Chrome.");
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (_) {}
      setIsListening(false);
    } else {
      setSearchQuery("");
      setHints([]);
      setShowHints(false);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.error("Mic start error:", err);
      }
    }
  };

  // Outside click → close hints + dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
        setIsSettingsOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      const insideSearch =
        (searchBoxRef.current && searchBoxRef.current.contains(event.target)) ||
        (mobileSearchBoxRef.current &&
          mobileSearchBoxRef.current.contains(event.target));
      if (!insideSearch) {
        setShowHints(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ===== Profile fetch =====
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user || response.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
        if (error.response?.status === 401) handleSignOut();
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(Boolean(token));
      if (token) fetchProfile();
      else setUser(null);
    };
    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [isLoggedIn]);

  // ===== Notification unread count =====
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchNotifications());
    }
  }, [isLoggedIn, dispatch]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    setIsSettingsOpen(false);
    setIsNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen((prev) => !prev);
    setIsDropdownOpen(false);
    setIsSettingsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios
          .post(
            `${API_BASE_URL}/api/logout`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          )
          .catch(() => {});
      }
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setIsDropdownOpen(false);
      setIsSettingsOpen(false);
      setIsNotificationsOpen(false);
      dispatch(resetNotifications());
      window.dispatchEvent(new Event("auth-change"));
      navigate("/login");
    }
  };

  // Hint item click
  const onHintClick = (hint) => {
    const text =
      typeof hint === "string" ? hint : hint.text || hint.title || "";
    setSearchQuery(text);
    setShowHints(false);
    setIsMobileSearchOpen(false);
    handleSearch(text);
  };

  // Shared hints dropdown (rendered inside whichever search box is visible)
  const renderHints = () => (
    <div className="absolute top-full left-0 right-0 mt-2 bg-[#212121] border border-gray-700/80 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto overflow-x-hidden scroll-smooth py-1.5">
      {hints.map((hint, i) => {
        const text =
          typeof hint === "string"
            ? hint
            : hint.text || hint.title || hint.name || "";
        const type = hint.type || "";
        return (
          <button
            key={i}
            onClick={() => onHintClick(hint)}
            className="w-full px-4 py-2.5 text-left hover:bg-[#3a3a3a] flex items-center gap-3 text-white text-sm transition-colors"
          >
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <span className="truncate flex-1">{text}</span>
            {type === "channel" && (
              <span className="text-xs text-gray-500 flex-shrink-0">
                Channel
              </span>
            )}
            {type === "video" && (
              <span className="text-xs text-gray-500 flex-shrink-0">Video</span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f0f0f] border-b border-gray-800 h-14 flex items-center">
      <div className="flex items-center justify-between w-full px-4">
        {/* Left */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-[#272727] rounded-full transition-colors"
          >
            <Menu size={24} className="text-white" />
          </button>
          <div className="flex items-center gap-3">
            <span className="text-red-600 text-2xl sm:text-3xl font-bold">
              Vidoo
            </span>
            <div className="hidden sm:flex items-center gap-1.5 bg-[#272727] px-3 py-1 rounded-full border border-yellow-600/30">
              <Star size={18} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white font-semibold text-sm">
                {points.toFixed(2)}
              </span>
              <span className="text-gray-400 text-xs">pts</span>
            </div>
          </div>
        </div>

        {/* Center: Search + Hints + Mic */}
        <div className="flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8 hidden md:flex items-center gap-2.5">
          <div className="relative w-full" ref={searchBoxRef}>
            <input
              type="text"
              placeholder={isListening ? "Listening..." : "Search"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim() && hints.length > 0 && setShowHints(true)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
                if (e.key === "Escape") setShowHints(false);
              }}
              aria-label="Search"
              className={`w-full h-10 bg-[#121212] border rounded-full pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                isListening
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-700"
              }`}
            />
            <button
              onClick={() => handleSearch()}
              aria-label="Submit search"
              className="absolute right-1 top-1 bottom-1 w-9 flex items-center justify-center rounded-full hover:bg-[#272727] active:bg-[#333] transition-colors"
            >
              <Search size={18} className="text-gray-300" />
            </button>

            {/* ===== HINTS DROPDOWN ===== */}
            {showHints && hints.length > 0 && renderHints()}
          </div>

          {/* Mic */}
          <button
            onClick={handleMicClick}
            className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              isListening
                ? "bg-red-600 hover:bg-red-700 animate-pulse"
                : "hover:bg-[#272727]"
            }`}
            aria-label={isListening ? "Stop listening" : "Search with voice"}
            title={isListening ? "Stop listening" : "Search with voice"}
          >
            {isListening ? (
              <MicOff size={22} className="text-white" />
            ) : (
              <Mic size={22} className="text-white" />
            )}
          </button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => {
              setIsMobileSearchOpen(true);
              setIsDropdownOpen(false);
              setIsNotificationsOpen(false);
            }}
            className="p-2 hover:bg-[#272727] rounded-full transition-colors flex items-center justify-center md:hidden"
            aria-label="Search"
          >
            <Search size={22} className="text-white" />
          </button>

          <Link
            to="/uploadvideo"
            className="p-2 hover:bg-[#272727] rounded-full transition-colors flex items-center justify-center"
          >
            <Plus size={22} className="text-white" />
          </Link>

          <div className="relative" ref={notifRef}>
            <button
              onClick={toggleNotifications}
              className="p-2 hover:bg-[#272727] rounded-full transition-colors flex items-center justify-center relative"
              aria-label="Notifications"
            >
              <Bell size={22} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-600 border-2 border-[#0f0f0f] rounded-full text-[11px] font-semibold text-white flex items-center justify-center">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              isOpen={isNotificationsOpen}
              onClose={() => setIsNotificationsOpen(false)}
            />
          </div>

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            {isLoggedIn ? (
              <button
                onClick={toggleDropdown}
                className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-blue-400 transition-all overflow-hidden"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-semibold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-full transition"
              >
                Sign in
              </button>
            )}

            {isLoggedIn && isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100dvh-5rem)] overflow-y-auto overflow-x-hidden scroll-smooth bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-2xl z-50 text-white">
                <div className="sticky top-0 z-10 px-5 py-5 border-b border-gray-800 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex-shrink-0 shadow-md overflow-hidden relative">
                      {user?.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.name || "User"}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-semibold truncate">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-400 mt-0.5 truncate">
                        {user?.email || "@username"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-yellow-400">
                        <Star size={14} className="fill-yellow-400" />
                        <span>{points.toFixed(0)} pts</span>
                      </div>
                      <button
                        onClick={() => {
                          navigate(`/channel/${user?._id || "me"}`);
                          setIsDropdownOpen(false);
                        }}
                        className="mt-3 w-full py-2 bg-[#272727] hover:bg-[#3a3a3a] rounded text-sm font-medium transition-colors"
                      >
                        View your channel
                      </button>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
                  >
                    <User size={20} className="text-gray-300" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/studio");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition"
                  >
                    <Video size={20} className="text-gray-300" />
                    <span>Vidoo Studio</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center justify-between transition"
                    >
                      <div className="flex items-center gap-4">
                        <Settings size={20} className="text-gray-300" />
                        <span>Settings</span>
                      </div>
                      {isSettingsOpen ? (
                        <ChevronDown size={18} />
                      ) : (
                        <ChevronRight size={18} />
                      )}
                    </button>
                    {isSettingsOpen && (
                      <div className="bg-[#1a1a1a] border-t border-b border-gray-800 py-1">
                        <button
                          onClick={() => {
                            navigate("/history");
                            setIsDropdownOpen(false);
                            setIsSettingsOpen(false);
                          }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                        >
                          <History size={18} />
                          <span>History</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/liked-videos");
                            setIsDropdownOpen(false);
                            setIsSettingsOpen(false);
                          }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                        >
                          <Heart size={18} />
                          <span>Liked Videos</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/watch-later");
                            setIsDropdownOpen(false);
                            setIsSettingsOpen(false);
                          }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                        >
                          <Clock size={18} />
                          <span>Watch Later</span>
                        </button>
                        <button
                          onClick={() => {
                            navigate("/your-videos");
                            setIsDropdownOpen(false);
                            setIsSettingsOpen(false);
                          }}
                          className="w-full px-9 py-2.5 text-left hover:bg-[#272727] flex items-center gap-4 text-sm transition"
                        >
                          <Video size={18} />
                          <span>Your Videos</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/withdraw"
                    onClick={() => setIsDropdownOpen(false)}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
                  >
                    <Wallet size={20} className="text-gray-300" />
                    <span>Withdraw Rewards</span>
                  </Link>
                </div>

                <Link
                  to="/leaderboard"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 mt-1"
                >
                  <Star size={20} className="text-gray-300" />
                  <span>Leaderboard</span>
                </Link>

                <div className="py-1 border-t border-gray-800">
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <HelpCircle size={20} className="text-gray-300" />
                    <span>FAQ</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <MessageCircle size={20} className="text-gray-300" />
                    <span>Feedback</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <PhoneCall size={20} className="text-gray-300" />
                    <span>Customer Support</span>
                  </button>
                  <button className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition">
                    <FileText size={20} className="text-gray-300" />
                    <span>Terms and Conditions</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-5 py-3 text-left hover:bg-[#272727] flex items-center gap-4 transition border-t border-gray-800 text-red-400 hover:text-red-300"
                  >
                    <LogOut size={20} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Listening Overlay */}
      {isListening && (
        <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center">
          <div className="bg-[#1a1a1a] border border-gray-700 rounded-2xl p-8 max-w-md w-full mx-4 text-center shadow-2xl">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-red-600/30 rounded-full animate-ping" />
              <div className="relative w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
                <Mic size={40} className="text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Listening...
            </h3>
            <p className="text-gray-400 text-sm mb-4">Speak now to search</p>
            {searchQuery && (
              <p className="text-white text-lg font-medium mb-6 px-4 py-2 bg-[#272727] rounded-lg">
                "{searchQuery}"
              </p>
            )}
            <button
              onClick={handleMicClick}
              className="px-6 py-2.5 bg-[#272727] hover:bg-[#3a3a3a] text-white rounded-full text-sm font-medium transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div
          className="absolute inset-0 z-50 bg-[#0f0f0f] flex items-center gap-2 px-3"
          ref={mobileSearchRef}
        >
          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 -ml-1 rounded-full hover:bg-[#272727] transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Close search"
          >
            <ArrowLeft size={22} className="text-white" />
          </button>

          <div className="relative flex-1 min-w-0" ref={mobileSearchBoxRef}>
            <input
              type="text"
              autoFocus
              placeholder={isListening ? "Listening..." : "Search"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim() && hints.length > 0 && setShowHints(true)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                  setIsMobileSearchOpen(false);
                }
                if (e.key === "Escape") setIsMobileSearchOpen(false);
              }}
              aria-label="Search"
              className={`w-full h-10 bg-[#121212] border rounded-full pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none transition-all duration-200 hover:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                isListening
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : "border-gray-700"
              }`}
            />
            <button
              onClick={() => {
                handleSearch();
                setIsMobileSearchOpen(false);
              }}
              aria-label="Submit search"
              className="absolute right-1 top-1 bottom-1 w-9 flex items-center justify-center rounded-full hover:bg-[#272727] active:bg-[#333] transition-colors"
            >
              <Search size={18} className="text-gray-300" />
            </button>
            {showHints && hints.length > 0 && renderHints()}
          </div>

          <button
            onClick={handleMicClick}
            className={`p-2.5 rounded-full transition-all flex-shrink-0 ${
              isListening ? "bg-red-600 animate-pulse" : "hover:bg-[#272727]"
            }`}
            aria-label={isListening ? "Stop listening" : "Search with voice"}
          >
            {isListening ? (
              <MicOff size={22} className="text-white" />
            ) : (
              <Mic size={22} className="text-white" />
            )}
          </button>

          <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 rounded-full hover:bg-[#272727] transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Close search"
          >
            <X size={22} className="text-white" />
          </button>
        </div>
      )}
    </header>
  );
}
