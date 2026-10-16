"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, Bell, CalendarDays, Check, ChevronDown,
  ChevronLeft, ChevronRight, Download, FileText, Hash,
  Menu, MessageCircle, MessageSquare, Mic, MicOff,
  MonitorUp, Paperclip, Phone, PhoneOff, Plus, Reply,
  Search, Send, Settings, ShieldCheck, Users, Video,
  VideoOff, X, PanelsTopLeft, UserRound, Heart, Clock3,
  CalendarPlus, MoreHorizontal, Smile, AtSign, Bold,
  Italic, Link2, CircleHelp, Headphones
} from "lucide-react";

const initialTeams = [
  {
    id: "wegrow",
    name: "WeGrow",
    initials: "WG",
    color: "green",
    channels: [
      { id: "wegrow-announcements", name: "announcements" },
      { id: "wegrow-general", name: "general" },
      { id: "wegrow-hr-help", name: "hr-help" }
    ]
  },
  {
    id: "skillcampus",
    name: "SkillCampus",
    initials: "SC",
    color: "blue",
    channels: [
      { id: "skillcampus-announcements", name: "announcements" },
      { id: "skillcampus-general", name: "general" },
      { id: "skillcampus-batches", name: "batches" }
    ]
  },
  {
    id: "bschool",
    name: "BSchool",
    initials: "BS",
    color: "red",
    channels: [
      { id: "bschool-announcements", name: "announcements" },
      { id: "bschool-general", name: "general" },
      { id: "bschool-admissions", name: "admissions" }
    ]
  }
];

const people = [
  {
    id: "priya",
    name: "Priya Raghavan",
    role: "HR & Operations",
    initials: "PR",
    color: "pink",
    status: "Available"
  },
  {
    id: "farhan",
    name: "Farhan Ali",
    role: "Business Operations",
    initials: "FA",
    color: "brown",
    status: "Available"
  },
  {
    id: "ananya",
    name: "Ananya Kumar",
    role: "Learning & Development",
    initials: "AK",
    color: "purple",
    status: "Busy"
  },
  {
    id: "rahul",
    name: "Rahul Menon",
    role: "Engineering",
    initials: "RM",
    color: "blue",
    status: "Away"
  },
  {
    id: "meena",
    name: "Meena S",
    role: "Admissions",
    initials: "MS",
    color: "orange",
    status: "Available"
  }
];

const today = () => {
  const d = new Date();

  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
};

const initialPosts = [
  {
    id: 1,
    channelId: "wegrow-hr-help",
    author: "Priya Raghavan",
    initials: "PR",
    avatar: "pink",
    time: "Today at 11:00 AM",
    title: "Investment declarations due 15 Oct",
    content:
      "Reminder: please submit your investment declarations for this financial year by 15 October. The updated leave policy is attached below.",
    likes: 3,
    liked: false,
    comments: [
      {
        id: 11,
        author: "Farhan Ali",
        initials: "FA",
        avatar: "brown",
        text: "Do we need to upload rent receipts now or only in January?",
        time: "11:40 AM"
      },
      {
        id: 12,
        author: "Priya Raghavan",
        initials: "PR",
        avatar: "pink",
        text: "Only the declaration for now. Receipts are needed in January for proof submission.",
        time: "12:05 PM"
      }
    ],
    attachment: null
  },
  {
    id: 2,
    channelId: "wegrow-hr-help",
    author: "Priya Raghavan",
    initials: "PR",
    avatar: "pink",
    time: "Today at 11:01 AM",
    title: "Updated leave policy",
    content:
      "Please refer to the latest policy document for leave balances, holidays, and approval timelines.",
    likes: 1,
    liked: false,
    comments: [],
    attachment: {
      name: "Leave-policy-2026.txt",
      size: "234 B",
      text:
        "WEGROW CONNECTX — LEAVE POLICY 2026\n\nPlease submit planned leave requests through your team lead.\nFor questions, contact HR & Operations."
    }
  },
  {
    id: 3,
    channelId: "wegrow-announcements",
    author: "Priya Raghavan",
    initials: "PR",
    avatar: "pink",
    time: "Today at 9:15 AM",
    title: "Welcome to WeGrow ConnectX",
    content:
      "Use this channel for company updates, team-wide announcements, shared resources, and important dates.",
    likes: 5,
    liked: false,
    comments: [],
    attachment: null
  },
  {
    id: 4,
    channelId: "wegrow-general",
    author: "Farhan Ali",
    initials: "FA",
    avatar: "brown",
    time: "Today at 10:20 AM",
    title: "Team check-in",
    content:
      "Good morning everyone! Share your priorities for the day here so we can coordinate across teams.",
    likes: 2,
    liked: false,
    comments: [],
    attachment: null
  },
  {
    id: 5,
    channelId: "skillcampus-announcements",
    author: "Ananya Kumar",
    initials: "AK",
    avatar: "purple",
    time: "Today at 9:40 AM",
    title: "Upcoming learning sessions",
    content:
      "The next learning calendar is ready. Please review the dates and let your coordinator know if you need changes.",
    likes: 4,
    liked: false,
    comments: [],
    attachment: null
  },
  {
    id: 6,
    channelId: "skillcampus-batches",
    author: "Rahul Menon",
    initials: "RM",
    avatar: "blue",
    time: "Today at 10:05 AM",
    title: "Batch progress update",
    content:
      "Please post the latest attendance and assignment progress for your batch before the end of the day.",
    likes: 1,
    liked: false,
    comments: [],
    attachment: null
  },
  {
    id: 7,
    channelId: "bschool-admissions",
    author: "Meena S",
    initials: "MS",
    avatar: "orange",
    time: "Today at 10:45 AM",
    title: "Admissions follow-up",
    content:
      "Please update the applicant follow-up status and flag any cases that need a second review.",
    likes: 0,
    liked: false,
    comments: [],
    attachment: null
  }
];

const navigation = [
  { id: "activity", label: "Activity", Icon: Activity },
  { id: "chat", label: "Chat", Icon: MessageSquare, count: 2 },
  { id: "teams", label: "Teams", Icon: Users },
  { id: "calendar", label: "Calendar", Icon: CalendarDays },
  { id: "files", label: "Files", Icon: FileText },
  { id: "people", label: "People", Icon: UserRound },
  { id: "admin", label: "Admin", Icon: ShieldCheck }
];

function Avatar({ initials, color = "blue", online = false }) {
  return (
    <span className={`avatar avatar-${color}`}>
      {initials}
      {online && <span className="presence-dot" />}
    </span>
  );
}

function getCalendarCells(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const offset = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();

  const cells = Array(offset).fill(null);

  for (let day = 1; day <= count; day++) {
    cells.push(day);
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatMonth(date) {
  return date.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HomePage() {
  const [teams, setTeams] = useState(initialTeams);
  const [expandedTeams, setExpandedTeams] = useState({
    wegrow: true,
    skillcampus: true,
    bschool: true
  });

  const [activeView, setActiveView] = useState("teams");
  const [activeChannelId, setActiveChannelId] = useState("wegrow-hr-help");
  const [activeTab, setActiveTab] = useState("posts");
  const [search, setSearch] = useState("");

  const [posts, setPosts] = useState(initialPosts);
  const [postDraft, setPostDraft] = useState("");
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [commentDrafts, setCommentDrafts] = useState({});
  const [commentOpen, setCommentOpen] = useState({});

  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    title: "",
    attendees: "",
    date: today(),
    start: "09:30",
    end: "10:00",
    channel: "wegrow-hr-help",
    online: true,
    details: ""
  });

  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: "Weekly team sync",
      date: today(),
      start: "11:00",
      end: "11:30",
      attendees: "Priya Raghavan, Farhan Ali",
      channel: "wegrow-general",
      online: true,
      details: "Weekly priorities and blockers."
    },
    {
      id: 2,
      title: "Admissions review",
      date: today(),
      start: "14:00",
      end: "14:45",
      attendees: "Meena S, Ananya Kumar",
      channel: "bschool-admissions",
      online: true,
      details: "Review this week's admissions pipeline."
    }
  ]);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(today());

  const [contactId, setContactId] = useState("priya");
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState({
    priya: [
      {
        text: "Hi! Let me know if you have any HR questions.",
        mine: false,
        time: "10:24 AM"
      }
    ],
    farhan: [
      {
        text: "I have shared the weekly update in General.",
        mine: false,
        time: "Yesterday"
      }
    ],
    ananya: [
      {
        text: "The learning calendar is ready to review.",
        mine: false,
        time: "Yesterday"
      }
    ],
    rahul: [],
    meena: []
  });

  const [callStage, setCallStage] = useState("home");
  const [callTitle, setCallTitle] = useState("Instant meeting");
  const [cameraOn, setCameraOn] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [cameraError, setCameraError] = useState("");

  const [showTeamModal, setShowTeamModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [toast, setToast] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const allChannels = teams.flatMap((team) =>
    team.channels.map((channel) => ({
      ...channel,
      teamId: team.id,
      teamName: team.name,
      teamColor: team.color,
      teamInitials: team.initials
    }))
  );

  const currentChannel =
    allChannels.find((channel) => channel.id === activeChannelId) ||
    allChannels[0];

  const currentTeam = teams.find(
    (team) => team.id === currentChannel?.teamId
  );

  const contact =
    people.find((person) => person.id === contactId) || people[0];

  const visiblePosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const channelMatches = post.channelId === activeChannelId;
      const searchMatches =
        !query ||
        `${post.title} ${post.content} ${post.author}`
          .toLowerCase()
          .includes(query);

      return channelMatches && searchMatches;
    });
  }, [posts, activeChannelId, search]);

  const allFiles = posts.filter((post) => post.attachment);

  const filesForChannel = allFiles.filter(
    (post) => post.channelId === activeChannelId
  );

  const selectedDateMeetings = meetings.filter(
    (meeting) => meeting.date === selectedDate
  );

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function selectView(view) {
    setActiveView(view);
    setMobileSidebarOpen(false);

    if (view !== "calls") {
      setCallStage("home");
    }
  }

  function selectChannel(channelId) {
    setActiveChannelId(channelId);
    setActiveView("teams");
    setActiveTab("posts");
    setMobileSidebarOpen(false);
  }

  function toggleTeam(teamId) {
    setExpandedTeams((previous) => ({
      ...previous,
      [teamId]: !previous[teamId]
    }));
  }

  function openMeetingForm() {
    setMeetingForm({
      title: "",
      attendees: "",
      date: selectedDate || today(),
      start: "09:30",
      end: "10:00",
      channel: activeChannelId,
      online: true,
      details: ""
    });

    setShowMeetingModal(true);
  }

  function submitPost(event) {
    event.preventDefault();

    if (!postDraft.trim() && !attachment) return;

    const newPost = {
      id: Date.now(),
      channelId: activeChannelId,
      author: "You",
      initials: "YO",
      avatar: "magenta",
      time: "Just now",
      title: postDraft.trim().split("\n")[0].slice(0, 100) ||
        attachment?.name ||
        "Shared an attachment",
      content: postDraft.trim(),
      likes: 0,
      liked: false,
      comments: [],
      attachment: attachment
        ? {
            name: attachment.name,
            size: formatBytes(attachment.size),
            file: attachment
          }
        : null
    };

    setPosts((previous) => [newPost, ...previous]);
    setPostDraft("");
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    notify("Your post has been added.");
  }

  function toggleLike(postId) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.likes + (post.liked ? -1 : 1)
            }
          : post
      )
    );
  }

  function submitComment(event, postId) {
    event.preventDefault();

    const text = (commentDrafts[postId] || "").trim();
    if (!text) return;

    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: "You",
                  initials: "YO",
                  avatar: "magenta",
                  text,
                  time: "Just now"
                }
              ]
            }
          : post
      )
    );

    setCommentDrafts((previous) => ({
      ...previous,
      [postId]: ""
    }));

    notify("Reply added.");
  }

  function downloadAttachment(attachment) {
    if (!attachment) return;

    let url;

    if (attachment.file instanceof Blob) {
      url = URL.createObjectURL(attachment.file);
    } else {
      const blob = new Blob(
        [attachment.text || "WeGrow ConnectX shared file"],
        { type: "text/plain" }
      );
      url = URL.createObjectURL(blob);
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = attachment.name || "attachment.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function submitMeeting(event) {
    event.preventDefault();

    if (meetingForm.end <= meetingForm.start) {
      notify("End time must be later than start time.");
      return;
    }

    const meeting = {
      ...meetingForm,
      id: Date.now()
    };

    setMeetings((previous) =>
      [...previous, meeting].sort((a, b) =>
        `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)
      )
    );

    setSelectedDate(meetingForm.date);
    setShowMeetingModal(false);

    notify(
      "Meeting saved in this browser demo. Connect a backend to send invitations."
    );
  }

  function createTeam(event) {
    event.preventDefault();

    const name = teamName.trim();
    if (!name) return;

    const id = `team-${Date.now()}`;

    const newTeam = {
      id,
      name,
      initials: name.slice(0, 2).toUpperCase(),
      color: "purple",
      channels: [
        { id: `${id}-announcements`, name: "announcements" },
        { id: `${id}-general`, name: "general" }
      ]
    };

    setTeams((previous) => [...previous, newTeam]);
    setExpandedTeams((previous) => ({ ...previous, [id]: true }));
    setTeamName("");
    setShowTeamModal(false);

    selectChannel(`${id}-general`);
    notify("Team created.");
  }

  function addChannel(team) {
    const name = window.prompt("Enter the new channel name:");
    if (!name?.trim()) return;

    const cleanName = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9- ]/g, "")
      .replace(/\s+/g, "-");

    if (!cleanName) return;

    const id = `${team.id}-${cleanName}`;

    if (team.channels.some((channel) => channel.id === id)) {
      notify("That channel already exists.");
      return;
    }

    setTeams((previous) =>
      previous.map((item) =>
        item.id === team.id
          ? {
              ...item,
              channels: [
                ...item.channels,
                { id, name: cleanName }
              ]
            }
          : item
      )
    );

    setExpandedTeams((previous) => ({
      ...previous,
      [team.id]: true
    }));

    selectChannel(id);
    notify("Channel created.");
  }

  function sendChat(event) {
    event.preventDefault();

    const text = chatDraft.trim();
    if (!text) return;

    setChatMessages((previous) => ({
      ...previous,
      [contactId]: [
        ...(previous[contactId] || []),
        {
          text,
          mine: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        }
      ]
    }));

    setChatDraft("");
  }

  function startCall(title = "Instant meeting") {
    setCallTitle(title);
    setActiveView("calls");
    setCallStage("room");
    setCameraError("");
  }

  async function toggleCamera() {
    if (cameraOn) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraOn(false);
      setMicOn(true);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is unavailable in this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = micOn;
      });

      setCameraOn(true);
      setCameraError("");
    } catch {
      setCameraError(
        "Camera or microphone permission was denied, or the device is unavailable."
      );
    }
  }

  function toggleMicrophone() {
    const nextValue = !micOn;
    setMicOn(nextValue);

    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = nextValue;
    });
  }

  async function shareScreen() {
    try {
      if (!navigator.mediaDevices?.getDisplayMedia) {
        throw new Error("Screen sharing is not supported.");
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      notify("Screen sharing started. Stop it using your browser controls.");

      screenStream.getVideoTracks()[0]?.addEventListener("ended", () => {
        notify("Screen sharing stopped.");
      });
    } catch {
      notify("Screen sharing was cancelled or is unavailable.");
    }
  }

  function leaveCall() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraOn(false);
    setMicOn(true);
    setCallStage("home");
    notify("You left the meeting.");
  }

  useEffect(() => {
    if (cameraOn && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraOn, callStage]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const rail = (
    <nav className="global-rail">
      {navigation.map(({ id, label, Icon, count }) => (
        <button
          key={id}
          className={`rail-item ${
            activeView === id ? "active" : ""
          }`}
          onClick={() => selectView(id)}
          title={label}
        >
          <span className="rail-icon">
            <Icon size={20} />
            {count && <i className="rail-count">{count}</i>}
          </span>
          <span>{label}</span>
        </button>
      ))}

      <div className="rail-spacer" />

      <button
        className={`rail-item ${
          activeView === "calls" ? "active" : ""
        }`}
        onClick={() => {
          setActiveView("calls");
          setCallStage("home");
        }}
      >
        <span className="rail-icon">
          <Video size={20} />
        </span>
        <span>Calls</span>
      </button>

      <button
        className="rail-item"
        onClick={() => selectView("admin")}
      >
        <span className="rail-icon">
          <Settings size={20} />
        </span>
        <span>Settings</span>
      </button>
    </nav>
  );

  const sidebar = (
    <aside
      className={`teams-sidebar ${
        mobileSidebarOpen ? "sidebar-mobile-open" : ""
      }`}
    >
      <div className="sidebar-heading">
        <h2>Teams</h2>
        <button
          className="icon-button"
          title="Create a team"
          onClick={() => setShowTeamModal(true)}
        >
          <Plus size={19} />
        </button>
      </div>

      <div className="team-list">
        {teams.map((team) => (
          <section className="team-group" key={team.id}>
            <div className="team-heading">
              <button
                className="chevron-button"
                onClick={() => toggleTeam(team.id)}
                aria-label={`Toggle ${team.name}`}
              >
                {expandedTeams[team.id] ? (
                  <ChevronDown size={15} />
                ) : (
                  <ChevronRight size={15} />
                )}
              </button>

              <button
                className="team-name-button"
                onClick={() => {
                  toggleTeam(team.id);
                  setActiveView("teams");
                }}
              >
                <span className={`team-badge badge-${team.color}`}>
                  {team.initials}
                </span>
                <span>{team.name}</span>
              </button>

              <button
                className="team-add-button"
                title="Add channel"
                onClick={() => addChannel(team)}
              >
                <Plus size={15} />
              </button>
            </div>

            {expandedTeams[team.id] && (
              <div className="channel-list">
                {team.channels
                  .filter((channel) => {
                    const query = search.trim().toLowerCase();
                    return (
                      !query ||
                      `${team.name} ${channel.name}`
                        .toLowerCase()
                        .includes(query)
                    );
                  })
                  .map((channel) => (
                    <button
                      key={channel.id}
                      className={`channel-item ${
                        activeChannelId === channel.id &&
                        activeView === "teams"
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => selectChannel(channel.id)}
                    >
                      <Hash size={13} />
                      <span>{channel.name}</span>
                    </button>
                  ))}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-footer-icon">
          <Headphones size={17} />
        </div>
        <div>
          <strong>WeGrow workspace</strong>
          <span>Team collaboration</span>
        </div>
      </div>
    </aside>
  );

  function renderPost(post) {
    return (
      <article className="post-card" key={post.id}>
        <div className="post-main">
          <Avatar initials={post.initials} color={post.avatar} />

          <div className="post-content">
            <div className="post-author-row">
              <div>
                <strong>{post.author}</strong>
                <span className="post-time">{post.time}</span>
              </div>

              <button
                className="icon-button"
                title="More options"
                onClick={() =>
                  notify("Additional post options can be connected here.")
                }
              >
                <MoreHorizontal size={18} />
              </button>
            </div>

            {post.title && (
              <h3 className="post-title">{post.title}</h3>
            )}

            {post.content && (
              <p className="post-text">{post.content}</p>
            )}

            {post.attachment && (
              <button
                className="attachment-card"
                onClick={() => downloadAttachment(post.attachment)}
              >
                <span className="attachment-icon">
                  <FileText size={20} />
                </span>

                <span className="attachment-info">
                  <strong>{post.attachment.name}</strong>
                  <small>{post.attachment.size}</small>
                </span>

                <Download size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="post-actions">
          <button
            className={`post-action ${post.liked ? "liked" : ""}`}
            onClick={() => toggleLike(post.id)}
          >
            <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
            <span>{post.likes || "Like"}</span>
          </button>

          <button
            className="post-action"
            onClick={() =>
              setCommentOpen((previous) => ({
                ...previous,
                [post.id]: !previous[post.id]
              }))
            }
          >
            <Reply size={16} />
            <span>Reply</span>
            {post.comments.length > 0 && (
              <span className="comment-count">
                {post.comments.length}
              </span>
            )}
          </button>

          {post.comments.length > 0 && (
            <button
              className="post-action comment-toggle"
              onClick={() =>
                setCommentOpen((previous) => ({
                  ...previous,
                  [post.id]: !previous[post.id]
                }))
              }
            >
              <MessageCircle size={16} />
              <span>
                {commentOpen[post.id] ? "Hide replies" : "View replies"}
              </span>
            </button>
          )}
        </div>

        {(commentOpen[post.id] || post.comments.length > 0) && (
          <div className="post-comments">
            {post.comments.map((comment) => (
              <div className="comment-row" key={comment.id}>
                <Avatar
                  initials={comment.initials}
                  color={comment.avatar}
                />

                <div className="comment-content">
                  <div className="comment-author">
                    <strong>{comment.author}</strong>
                    <span>{comment.time}</span>
                  </div>

                  <p>{comment.text}</p>
                </div>
              </div>
            ))}

            {commentOpen[post.id] && (
              <form
                className="reply-form"
                onSubmit={(event) => submitComment(event, post.id)}
              >
                <Avatar initials="YO" color="magenta" />

                <input
                  value={commentDrafts[post.id] || ""}
                  onChange={(event) =>
                    setCommentDrafts((previous) => ({
                      ...previous,
                      [post.id]: event.target.value
                    }))
                  }
                  placeholder="Write a reply..."
                  aria-label="Write a reply"
                />

                <button
                  type="submit"
                  className="send-icon-button"
                  aria-label="Send reply"
                >
                  <Send size={17} />
                </button>
              </form>
            )}
          </div>
        )}
      </article>
    );
  }

  function renderComposer() {
    return (
      <form className="post-composer" onSubmit={submitPost}>
        <textarea
          value={postDraft}
          onChange={(event) => setPostDraft(event.target.value)}
          placeholder="Start a post. Type @ to mention someone"
          aria-label="Write a post"
          rows={2}
        />

        {attachment && (
          <div className="pending-attachment">
            <Paperclip size={15} />
            <span>{attachment.name}</span>
            <button
              type="button"
              onClick={() => {
                setAttachment(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="composer-toolbar">
          <div className="composer-tools">
            <button
              type="button"
              title="Bold"
              onClick={() => notify("Enter text in the post editor to format it.")}
            >
              <Bold size={15} />
            </button>

            <button
              type="button"
              title="Italic"
              onClick={() => notify("Enter text in the post editor to format it.")}
            >
              <Italic size={15} />
            </button>

            <button
              type="button"
              title="Mention"
              onClick={() => setPostDraft((draft) => `${draft}@`)}
            >
              <AtSign size={17} />
            </button>

            <button
              type="button"
              title="Emoji"
              onClick={() => setPostDraft((draft) => `${draft} 😊`)}
            >
              <Smile size={17} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden-file-input"
              onChange={(event) =>
                setAttachment(event.target.files?.[0] || null)
              }
            />

            <button
              type="button"
              title="Attach a file"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={17} />
            </button>
          </div>

          <button
            type="submit"
            className="send-post-button"
            title="Post message"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    );
  }

  function renderTeamsView() {
    return (
      <section className="teams-view">
        <header className="channel-header">
          <div className="channel-title-area">
            <span
              className={`team-badge badge-${currentChannel?.teamColor || "green"}`}
            >
              {currentChannel?.teamInitials || "WG"}
            </span>

            <div>
              <h1>
                {currentChannel?.name || "general"}
              </h1>
              <p>
                {currentChannel?.teamName || "WeGrow"} ·
                Questions, updates and collaboration
              </p>
            </div>
          </div>

          <div className="channel-header-actions">
            <button
              className="icon-button"
              title="Calendar"
              onClick={() => selectView("calendar")}
            >
              <CalendarDays size={19} />
            </button>

            <button
              className="primary-button meet-button"
              onClick={() => {
                setActiveView("calls");
                setCallStage("setup");
              }}
            >
              <Video size={17} />
              Meet
            </button>
          </div>
        </header>

        <div className="channel-tabs">
          <button
            className={activeTab === "posts" ? "active-tab" : ""}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>

          <button
            className={activeTab === "files" ? "active-tab" : ""}
            onClick={() => setActiveTab("files")}
          >
            Files
          </button>
        </div>

        {activeTab === "posts" ? (
          <>
            <div className="posts-scroll-area">
              <div className="date-separator">
                <span>
                  {new Date().toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long"
                  })}
                </span>
              </div>

              {visiblePosts.length > 0 ? (
                visiblePosts.map(renderPost)
              ) : (
                <div className="empty-state">
                  <MessageSquare size={36} />
                  <h2>No posts found</h2>
                  <p>
                    Start a conversation or try another search.
                  </p>
                </div>
              )}
            </div>

            {renderComposer()}
          </>
        ) : (
          <div className="files-panel">
            <div className="section-heading">
              <div>
                <h2>Channel files</h2>
                <p>Documents shared in this channel</p>
              </div>
            </div>

            {filesForChannel.length ? (
              filesForChannel.map((post) => (
                <button
                  className="file-list-row"
                  key={post.id}
                  onClick={() => downloadAttachment(post.attachment)}
                >
                  <span className="file-symbol">
                    <FileText size={22} />
                  </span>
                  <span className="file-list-info">
                    <strong>{post.attachment.name}</strong>
                    <small>
                      Shared by {post.author} · {post.attachment.size}
                    </small>
                  </span>
                  <Download size={18} />
                </button>
              ))
            ) : (
              <div className="empty-state">
                <FileText size={36} />
                <h2>No files yet</h2>
                <p>
                  Attach a file to a post to share it with your team.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    );
  }

  function renderActivityView() {
    return (
      <section className="page-view">
        <header className="page-header">
          <div>
            <h1>Activity</h1>
            <p>Your updates and workspace notifications</p>
          </div>
        </header>

        <div className="activity-list">
          <article className="activity-card">
            <Avatar initials="PR" color="pink" online />
            <div>
              <p>
                <strong>Priya Raghavan</strong> posted an update in
                <strong> hr-help</strong>.
              </p>
              <span>Investment declarations due 15 Oct · Today</span>
              <button
                className="text-link"
                onClick={() => selectChannel("wegrow-hr-help")}
              >
                View post
              </button>
            </div>
          </article>

          <article className="activity-card">
            <Avatar initials="FA" color="brown" online />
            <div>
              <p>
                <strong>Farhan Ali</strong> shared a message in
                <strong> general</strong>.
              </p>
              <span>Team check-in · Today</span>
              <button
                className="text-link"
                onClick={() => selectChannel("wegrow-general")}
              >
                View channel
              </button>
            </div>
          </article>

          <article className="activity-card">
            <Avatar initials="AK" color="purple" />
            <div>
              <p>
                <strong>Ananya Kumar</strong> shared learning updates.
              </p>
              <span>SkillCampus · Today</span>
              <button
                className="text-link"
                onClick={() => selectChannel("skillcampus-announcements")}
              >
                View update
              </button>
            </div>
          </article>
        </div>
      </section>
    );
  }

  function renderChatView() {
    const messages = chatMessages[contactId] || [];

    return (
      <section className="chat-view">
        <aside className="chat-contact-list">
          <div className="page-header compact-header">
            <h1>Chat</h1>
            <button
              className="icon-button"
              onClick={() => selectView("people")}
              title="Find people"
            >
              <Plus size={19} />
            </button>
          </div>

          {people.map((person) => (
            <button
              key={person.id}
              className={`contact-item ${
                contactId === person.id ? "selected" : ""
              }`}
              onClick={() => setContactId(person.id)}
            >
              <Avatar
                initials={person.initials}
                color={person.color}
                online={person.status === "Available"}
              />

              <span>
                <strong>{person.name}</strong>
                <small>{person.status}</small>
              </span>
            </button>
          ))}
        </aside>

        <div className="chat-conversation">
          <header className="conversation-header">
            <Avatar
              initials={contact.initials}
              color={contact.color}
              online={contact.status === "Available"}
            />
            <div>
              <strong>{contact.name}</strong>
              <small>{contact.status}</small>
            </div>

            <button
              className="icon-button"
              title="Start a call"
              onClick={() => startCall(`Call with ${contact.name}`)}
            >
              <Video size={20} />
            </button>
          </header>

          <div className="chat-messages">
            {messages.length ? (
              messages.map((message, index) => (
                <div
                  className={`chat-message ${
                    message.mine ? "mine" : ""
                  }`}
                  key={index}
                >
                  <p>{message.text}</p>
                  <small>{message.time}</small>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <MessageCircle size={34} />
                <h2>Start a conversation</h2>
                <p>Send a message to {contact.name}.</p>
              </div>
            )}
          </div>

          <form className="chat-input-form" onSubmit={sendChat}>
            <input
              value={chatDraft}
              onChange={(event) => setChatDraft(event.target.value)}
              placeholder={`Message ${contact.name}`}
            />
            <button className="primary-button" type="submit">
              <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    );
  }

  function renderCalendarView() {
    const cells = getCalendarCells(calendarDate);

    return (
      <section className="page-view calendar-view">
        <header className="page-header">
          <div>
            <h1>Calendar</h1>
            <p>Manage your schedule and team meetings</p>
          </div>

          <button
            className="primary-button"
            onClick={openMeetingForm}
          >
            <CalendarPlus size={17} />
            New meeting
          </button>
        </header>

        <div className="calendar-layout">
          <div className="calendar-card">
            <div className="calendar-toolbar">
              <h2>{formatMonth(calendarDate)}</h2>

              <div className="calendar-controls">
                <button
                  className="icon-button"
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                  aria-label="Previous month"
                >
                  <ChevronLeft size={19} />
                </button>

                <button
                  className="outline-button"
                  onClick={() => {
                    setCalendarDate(new Date());
                    setSelectedDate(today());
                  }}
                >
                  Today
                </button>

                <button
                  className="icon-button"
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                  aria-label="Next month"
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            </div>

            <div className="calendar-grid">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div className="calendar-weekday" key={day}>
                    {day}
                  </div>
                )
              )}

              {cells.map((day, index) => {
                const dateString = day
                  ? [
                      calendarDate.getFullYear(),
                      String(calendarDate.getMonth() + 1).padStart(2, "0"),
                      String(day).padStart(2, "0")
                    ].join("-")
                  : null;

                const hasMeeting = meetings.some(
                  (meeting) => meeting.date === dateString
                );

                return (
                  <button
                    key={`${day}-${index}`}
                    disabled={!day}
                    className={`calendar-day ${
                      dateString === selectedDate ? "selected-day" : ""
                    } ${
                      dateString === today() ? "today-day" : ""
                    }`}
                    onClick={() => day && setSelectedDate(dateString)}
                  >
                    <span>{day || ""}</span>
                    {hasMeeting && <i />}
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="agenda-card">
            <div>
              <h2>Agenda</h2>
              <p>{formatDate(new Date(`${selectedDate}T12:00:00`))}</p>
            </div>

            {selectedDateMeetings.length ? (
              selectedDateMeetings
                .slice()
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((meeting) => (
                  <article className="agenda-meeting" key={meeting.id}>
                    <span className="agenda-accent" />
                    <div className="agenda-meeting-content">
                      <strong>{meeting.title}</strong>
                      <span>
                        <Clock3 size={14} />
                        {meeting.start} – {meeting.end}
                      </span>
                      <small>
                        {meeting.attendees || "No attendees added"}
                      </small>

                      {meeting.online && (
                        <button
                          className="text-link"
                          onClick={() => startCall(meeting.title)}
                        >
                          Join meeting
                        </button>
                      )}
                    </div>
                  </article>
                ))
            ) : (
              <div className="agenda-empty">
                <CalendarDays size={30} />
                <p>No meetings scheduled for this date.</p>
              </div>
            )}

            <button
              className="outline-button full-width-button"
              onClick={openMeetingForm}
            >
              <Plus size={16} />
              Schedule meeting
            </button>
          </aside>
        </div>
      </section>
    );
  }

  function renderFilesView() {
    return (
      <section className="page-view">
        <header className="page-header">
          <div>
            <h1>Files</h1>
            <p>Shared documents from your workspace</p>
          </div>
        </header>

        <div className="section-card">
          <div className="file-table-header">
            <span>Name</span>
            <span>Shared by</span>
            <span>Channel</span>
            <span>Size</span>
            <span>Action</span>
          </div>

          {allFiles.length ? (
            allFiles.map((post) => {
              const channel = allChannels.find(
                (item) => item.id === post.channelId
              );

              return (
                <div className="file-table-row" key={post.id}>
                  <div className="file-name-cell">
                    <span className="file-symbol">
                      <FileText size={20} />
                    </span>
                    <strong>{post.attachment.name}</strong>
                  </div>

                  <span>{post.author}</span>

                  <button
                    className="text-link channel-file-link"
                    onClick={() => selectChannel(post.channelId)}
                  >
                    {channel?.teamName} / {channel?.name}
                  </button>

                  <span>{post.attachment.size}</span>

                  <button
                    className="icon-button"
                    onClick={() => downloadAttachment(post.attachment)}
                    title="Download file"
                  >
                    <Download size={18} />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <FileText size={34} />
              <h2>No files found</h2>
              <p>Files shared in channel posts will appear here.</p>
            </div>
          )}
        </div>
      </section>
    );
  }

  function renderPeopleView() {
    return (
      <section className="page-view">
        <header className="page-header">
          <div>
            <h1>People</h1>
            <p>Find and connect with your teammates</p>
          </div>
        </header>

        <div className="people-grid">
          {people
            .filter((person) =>
              `${person.name} ${person.role}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map((person) => (
              <article className="person-card" key={person.id}>
                <Avatar
                  initials={person.initials}
                  color={person.color}
                  online={person.status === "Available"}
                />

                <h2>{person.name}</h2>
                <p>{person.role}</p>

                <span
                  className={`status-pill ${
                    person.status === "Available" ? "status-available" : ""
                  }`}
                >
                  {person.status}
                </span>

                <div className="person-actions">
                  <button
                    className="outline-button"
                    onClick={() => {
                      setContactId(person.id);
                      selectView("chat");
                    }}
                  >
                    <MessageSquare size={15} />
                    Message
                  </button>

                  <button
                    className="outline-button"
                    onClick={() => startCall(`Call with ${person.name}`)}
                  >
                    <Video size={15} />
                    Call
                  </button>
                </div>
              </article>
            ))}
        </div>
      </section>
    );
  }

  function renderAdminView() {
    return (
      <section className="page-view">
        <header className="page-header">
          <div>
            <h1>Administration</h1>
            <p>Workspace settings and management</p>
          </div>
        </header>

        <div className="admin-grid">
          <button
            className="admin-card"
            onClick={() => setShowTeamModal(true)}
          >
            <Users size={26} />
            <strong>Team management</strong>
            <span>Create teams and default channels.</span>
            <Plus size={18} />
          </button>

          <button
            className="admin-card"
            onClick={() => selectView("people")}
          >
            <ShieldCheck size={26} />
            <strong>People & access</strong>
            <span>View workspace members and statuses.</span>
            <ChevronRight size={18} />
          </button>

          <button
            className="admin-card"
            onClick={() => notify("Notifications are enabled for this UI demo.")}
          >
            <Bell size={26} />
            <strong>Notifications</strong>
            <span>Review workspace notification settings.</span>
            <ChevronRight size={18} />
          </button>

          <button
            className="admin-card"
            onClick={() => notify("Backend integration is required for shared settings.")}
          >
            <Settings size={26} />
            <strong>Workspace settings</strong>
            <span>Configure shared workspace preferences.</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>
    );
  }

  function renderCallView() {
    if (callStage === "room") {
      return (
        <section className="call-room">
          <header className="call-room-header">
            <div>
              <h1>{callTitle}</h1>
              <p>WeGrow ConnectX meeting room</p>
            </div>

            <span className="call-room-status">
              <i />
              Ready
            </span>
          </header>

          <div className="call-room-main">
            <div className="video-stage">
              {cameraOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="local-video"
                />
              ) : (
                <div className="camera-placeholder">
                  <div className="camera-placeholder-icon">
                    <VideoOff size={34} />
                  </div>
                  <h2>Your camera is off</h2>
                  <p>Turn on your camera to preview yourself.</p>
                </div>
              )}

              <div className="video-self-label">
                <Avatar initials="YO" color="magenta" />
                <span>You</span>
              </div>

              {cameraError && (
                <div className="camera-error">{cameraError}</div>
              )}
            </div>

            <aside className="meeting-side-panel">
              <div className="side-panel-title">
                <h2>Meeting details</h2>
                <Users size={19} />
              </div>

              <p>
                Use the controls below to manage your local camera,
                microphone and screen-sharing permission.
              </p>

              <div className="meeting-detail-row">
                <Clock3 size={17} />
                <span>Meeting in progress</span>
              </div>

              <div className="meeting-detail-row">
                <ShieldCheck size={17} />
                <span>Browser media permissions</span>
              </div>

              <div className="meeting-notice">
                This screen provides local device controls. Real
                multi-user calling needs a connected video service.
              </div>
            </aside>
          </div>

          <footer className="call-controls">
            <button
              className={`call-control ${!micOn ? "control-off" : ""}`}
              onClick={toggleMicrophone}
            >
              {micOn ? <Mic size={21} /> : <MicOff size={21} />}
              <span>{micOn ? "Mute" : "Unmute"}</span>
            </button>

            <button
              className={`call-control ${!cameraOn ? "control-off" : ""}`}
              onClick={toggleCamera}
            >
              {cameraOn ? <Video size={21} /> : <VideoOff size={21} />}
              <span>{cameraOn ? "Stop video" : "Start video"}</span>
            </button>

            <button className="call-control" onClick={shareScreen}>
              <MonitorUp size={21} />
              <span>Share screen</span>
            </button>

            <button
              className="call-control"
              onClick={openMeetingForm}
            >
              <CalendarPlus size={21} />
              <span>Schedule</span>
            </button>

            <button className="leave-call-button" onClick={leaveCall}>
              <PhoneOff size={19} />
              Leave
            </button>
          </footer>
        </section>
      );
    }

    if (callStage === "setup") {
      return (
        <section className="page-view call-setup-page">
          <header className="page-header">
            <div>
              <h1>Meet</h1>
              <p>Start an instant meeting or schedule one for later.</p>
            </div>
          </header>

          <div className="call-setup-card">
            <div className="setup-icon">
              <Video size={30} />
            </div>

            <h2>Start a meeting</h2>
            <p>
              Open a meeting room and choose your camera and microphone
              settings.
            </p>

            <button
              className="primary-button"
              onClick={() => startCall("Instant meeting")}
            >
              <Video size={17} />
              Start meeting
            </button>

            <button
              className="outline-button"
              onClick={openMeetingForm}
            >
              <CalendarPlus size={17} />
              Schedule for later
            </button>
          </div>

          <button
            className="text-link back-link"
            onClick={() => setCallStage("home")}
          >
            <ChevronLeft size={16} />
            Back to calls
          </button>
        </section>
      );
    }

    return (
      <section className="page-view">
        <header className="page-header">
          <div>
            <h1>Calls and meetings</h1>
            <p>Connect with your teammates</p>
          </div>

          <button
            className="primary-button"
            onClick={() => setCallStage("setup")}
          >
            <Video size={17} />
            New meeting
          </button>
        </header>

        <div className="call-hero">
          <div className="call-hero-copy">
            <span className="eyebrow">WEGROW CONNECTX</span>
            <h2>Bring your team together.</h2>
            <p>
              Start an instant meeting or schedule time with your
              teammates.
            </p>

            <div className="call-hero-actions">
              <button
                className="primary-button"
                onClick={() => startCall("Instant meeting")}
              >
                <Video size={17} />
                Meet now
              </button>

              <button
                className="outline-button"
                onClick={openMeetingForm}
              >
                <CalendarPlus size={17} />
                Schedule a meeting
              </button>
            </div>
          </div>

          <div className="call-hero-art">
            <div className="art-circle circle-one" />
            <div className="art-circle circle-two" />
            <div className="art-video-card">
              <Video size={48} />
              <span>Team meeting</span>
            </div>
          </div>
        </div>

        <div className="section-heading meeting-list-heading">
          <div>
            <h2>Upcoming meetings</h2>
            <p>Your scheduled team sessions</p>
          </div>
          <button
            className="text-link"
            onClick={() => selectView("calendar")}
          >
            Open calendar
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="meeting-list">
          {meetings
            .slice()
            .sort((a, b) =>
              `${a.date} ${a.start}`.localeCompare(`${b.date} ${b.start}`)
            )
            .map((meeting) => (
              <article className="meeting-list-card" key={meeting.id}>
                <div className="meeting-date-block">
                  <strong>
                    {new Date(`${meeting.date}T12:00:00`).getDate()}
                  </strong>
                  <span>
                    {new Date(`${meeting.date}T12:00:00`)
                      .toLocaleDateString("en-IN", { month: "short" })
                      .toUpperCase()}
                  </span>
                </div>

                <div className="meeting-info">
                  <strong>{meeting.title}</strong>
                  <span>
                    <Clock3 size={14} />
                    {meeting.start} – {meeting.end}
                  </span>
                  <small>
                    {meeting.attendees || "No attendees added"}
                  </small>
                </div>

                {meeting.online && (
                  <button
                    className="outline-button"
                    onClick={() => startCall(meeting.title)}
                  >
                    <Video size={16} />
                    Join
                  </button>
                )}
              </article>
            ))}
        </div>
      </section>
    );
  }

  function renderMainView() {
    switch (activeView) {
      case "teams":
        return renderTeamsView();
      case "activity":
        return renderActivityView();
      case "chat":
        return renderChatView();
      case "calendar":
        return renderCalendarView();
      case "files":
        return renderFilesView();
      case "people":
        return renderPeopleView();
      case "admin":
        return renderAdminView();
      case "calls":
        return renderCallView();
      default:
        return renderTeamsView();
    }
  }

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <button
          className="mobile-menu-button icon-button"
          onClick={() => setMobileSidebarOpen((value) => !value)}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <button
          className="brand-area"
          onClick={() => selectView("teams")}
          aria-label="Go to WeGrow ConnectX home"
        >
          <span className="brand-mark">
            <PanelsTopLeft size={20} />
          </span>
          <span className="brand-name">WeGrow ConnectX</span>
          <span className="environment-chip">Workspace</span>
        </button>

        <div className="global-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search people, messages and channels"
            aria-label="Search workspace"
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
          {!search && <kbd>Ctrl K</kbd>}
        </div>

        <div className="topbar-actions">
          <button
            className="topbar-icon"
            title="Help"
            onClick={() => notify("Welcome to WeGrow ConnectX.")}
          >
            <CircleHelp size={19} />
          </button>

          <button
            className="topbar-icon notification-button"
            title="Notifications"
            onClick={() => selectView("activity")}
          >
            <Bell size={19} />
            <i />
          </button>

          <button
            className="profile-button"
            title="Your profile"
            onClick={() => notify("Signed in as a workspace member.")}
          >
            <Avatar initials="WA" color="magenta" online />
          </button>
        </div>
      </header>

      <div className="app-body">
        {rail}
        {sidebar}

        <main className="main-workspace">
          {renderMainView()}
        </main>
      </div>

      {showMeetingModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowMeetingModal(false);
            }
          }}
        >
          <section
            className="meeting-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-meeting-title"
          >
            <header className="modal-header">
              <h2 id="new-meeting-title">New meeting</h2>
              <button
                className="icon-button"
                onClick={() => setShowMeetingModal(false)}
                aria-label="Close meeting form"
              >
                <X size={20} />
              </button>
            </header>

            <form className="meeting-form" onSubmit={submitMeeting}>
              <label className="form-field">
                <span>Title</span>
                <input
                  autoFocus
                  required
                  value={meetingForm.title}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      title: event.target.value
                    }))
                  }
                  placeholder="Add a title"
                />
              </label>

              <label className="form-field">
                <span>Attendees</span>
                <input
                  value={meetingForm.attendees}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      attendees: event.target.value
                    }))
                  }
                  placeholder="Add required attendees"
                />
              </label>

              <div className="date-time-grid">
                <label className="form-field">
                  <span>Date</span>
                  <input
                    type="date"
                    required
                    value={meetingForm.date}
                    onChange={(event) =>
                      setMeetingForm((previous) => ({
                        ...previous,
                        date: event.target.value
                      }))
                    }
                  />
                </label>

                <label className="form-field">
                  <span>Start</span>
                  <input
                    type="time"
                    required
                    value={meetingForm.start}
                    onChange={(event) =>
                      setMeetingForm((previous) => ({
                        ...previous,
                        start: event.target.value
                      }))
                    }
                  />
                </label>

                <label className="form-field">
                  <span>End</span>
                  <input
                    type="time"
                    required
                    value={meetingForm.end}
                    onChange={(event) =>
                      setMeetingForm((previous) => ({
                        ...previous,
                        end: event.target.value
                      }))
                    }
                  />
                </label>
              </div>

              <label className="form-field">
                <span>Post in a channel (optional)</span>
                <select
                  value={meetingForm.channel}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      channel: event.target.value
                    }))
                  }
                >
                  <option value="">Do not post in a channel</option>

                  {teams.map((team) => (
                    <optgroup label={team.name} key={team.id}>
                      {team.channels.map((channel) => (
                        <option value={channel.id} key={channel.id}>
                          #{channel.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </label>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={meetingForm.online}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      online: event.target.checked
                    }))
                  }
                />
                <span>Create an online meeting</span>
              </label>

              <label className="form-field">
                <span>Details</span>
                <textarea
                  value={meetingForm.details}
                  onChange={(event) =>
                    setMeetingForm((previous) => ({
                      ...previous,
                      details: event.target.value
                    }))
                  }
                  placeholder="Agenda, notes or location"
                  rows={3}
                />
              </label>

              <footer className="modal-footer">
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setShowMeetingModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  Send invite
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {showTeamModal && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowTeamModal(false);
            }
          }}
        >
          <section
            className="simple-modal"
            role="dialog"
            aria-modal="true"
          >
            <header className="modal-header">
              <h2>Create a team</h2>
              <button
                className="icon-button"
                onClick={() => setShowTeamModal(false)}
                aria-label="Close"
              >
                <X size={19} />
              </button>
            </header>

            <form onSubmit={createTeam}>
              <p className="modal-description">
                A new team will include announcements and general channels.
              </p>

              <label className="form-field">
                <span>Team name</span>
                <input
                  autoFocus
                  required
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="e.g. Marketing"
                />
              </label>

              <footer className="modal-footer">
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => setShowTeamModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  Create team
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div className="toast-message" role="status">
          <Check size={17} />
          <span>{toast}</span>
          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}