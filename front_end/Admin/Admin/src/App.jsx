import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Bell,
  CalendarDays,
  Check,
  ContactRound,
  Download,
  FileSpreadsheet,
  FileText,
  KeyRound,
  LogOut,
  MessageSquare,
  Pencil,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Upload,
  UserRoundPen,
  UsersRound,
  Video,
  X,
} from "lucide-react";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const identityFields = [
  { name: "fullName", label: "Full name", placeholder: "e.g. Priya Raghavan" },
  {
    name: "workEmail",
    label: "Work email (their username)",
    placeholder: "e.g. priya@wegrow.in",
    type: "email",
  },
];
const initialSharedFiles = [
  {
    id: "sample-enrollment-csv",
    name: "quarterly-enrollment.csv",
    channel: "admissions",
    sharedBy: "Ananya Krishnan",
    sharedByInitials: "AK",
    date: "Oct 10, 2026",
    size: "24 KB",
    type: "csv",
    content: "Program,Applications,Enrolled\nWeGrow,184,72\nSkillCampus,126,58\nBSchool,93,41\n",
  },
  {
    id: "sample-team-updates",
    name: "team-updates.txt",
    channel: "general",
    sharedBy: "Priya Raghavan",
    sharedByInitials: "PR",
    date: "Oct 8, 2026",
    size: "2 KB",
    type: "txt",
    content: "Team updates\n\nPlease review the latest announcements in your organization channels.\n",
  },
];

const employeeFields = [
  { name: "employeeId", label: "Employee ID", placeholder: "e.g. WG-1042" },
  { name: "jobTitle", label: "Job title", placeholder: "e.g. Admissions Counsel" },
  { name: "department", label: "Department", placeholder: "e.g. Academics" },
];

const requiredFields = ["fullName", "workEmail", "employeeId", "jobTitle", "department"];
const defaultChannels = ["WeGrow", "SkillCampus", "BSchool"];
const presenceOptions = [
  { label: "Available", color: "bg-emerald-500" },
  { label: "Busy", color: "bg-red-500" },
  { label: "Do not disturb", color: "bg-red-600" },
  { label: "Be right back", color: "bg-amber-500" },
  { label: "Appear away", color: "bg-amber-400" },
  { label: "Appear offline", color: "bg-slate-400" },
];
const presenceColors = Object.fromEntries(
  presenceOptions.map(({ label, color }) => [label, color]),
);
const navigationItems = [
  { label: "Activity", icon: Bell },
  { label: "Chat", icon: MessageSquare },
  { label: "Teams", icon: UsersRound },
  { label: "Calendar", icon: CalendarDays },
  { label: "Files", icon: FileText },
  { label: "People", icon: ContactRound },
  { label: "Admin", icon: ShieldCheck },
];
const peopleSampleProfiles = [
  {
    fullName: "Ananya Krishnan",
    employeeId: "WG-0002",
    jobTitle: "Marketing Lead",
    department: "Marketing",
    teams: defaultChannels,
    status: "Available",
  },
  {
    fullName: "Arjun Mehta",
    employeeId: "WG-0003",
    jobTitle: "Head of Operations",
    department: "Operations",
    teams: ["WeGrow", "SkillCampus"],
    status: "Be right back",
  },
  {
    fullName: "Farhan Ali",
    employeeId: "WG-0004",
    jobTitle: "Finance Executive",
    department: "Finance",
    teams: ["WeGrow"],
    status: "Appear offline",
  },
  {
    fullName: "Karthik Rajan",
    employeeId: "WG-0005",
    jobTitle: "IT Support Engineer",
    department: "IT",
    teams: ["WeGrow"],
    status: "Available",
  },
  {
    fullName: "Kavya Subramanian",
    employeeId: "SC-0001",
    jobTitle: "Lead Trainer, Data Analytics",
    department: "Academics",
    teams: ["SkillCampus"],
    status: "Available",
  },
  {
    fullName: "Meera Iyer",
    employeeId: "BS-0001",
    jobTitle: "Program Director",
    department: "BSchool",
    teams: ["BSchool", "WeGrow"],
    status: "Be right back",
  },
  {
    fullName: "Priya Raghavan",
    employeeId: "WG-0006",
    jobTitle: "HR Manager",
    department: "Human Resources",
    teams: defaultChannels,
    status: "Available",
  },
];
const peopleAvatarColors = [
  "bg-violet-600",
  "bg-sky-600",
  "bg-rose-600",
  "bg-amber-600",
  "bg-teal-600",
  "bg-indigo-600",
  "bg-pink-600",
  "bg-cyan-700",
];
const peopleFilters = ["Everyone", ...defaultChannels];
const fileAvatarColors = [
  "bg-violet-600",
  "bg-sky-600",
  "bg-rose-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-indigo-600",
  "bg-teal-600",
];
const fileTypeColors = {
  csv: "bg-emerald-600",
  xls: "bg-emerald-600",
  xlsx: "bg-emerald-600",
  txt: "bg-slate-600",
  pdf: "bg-red-600",
  doc: "bg-blue-600",
  docx: "bg-blue-600",
  png: "bg-violet-600",
  jpg: "bg-violet-600",
  jpeg: "bg-violet-600",
};
const createEmptyFormData = () => ({
  fullName: "",
  workEmail: "",
  employeeId: "",
  jobTitle: "",
  department: "",
  role: "Employee",
});
const sampleColleagues = [
  { fullName: "Aarav Sharma", employeeId: "DEMO-1001", jobTitle: "Product Designer", department: "Design", teams: ["WeGrow"] },
  { fullName: "Diya Patel", employeeId: "DEMO-1002", jobTitle: "Admissions Counselor", department: "Admissions", teams: ["BSchool"] },
  { fullName: "Kabir Singh", employeeId: "DEMO-1003", jobTitle: "Software Engineer", department: "Technology", teams: ["WeGrow", "SkillCampus"] },
  { fullName: "Ananya Reddy", employeeId: "DEMO-1004", jobTitle: "People Partner", department: "People", teams: ["WeGrow"] },
  { fullName: "Ishaan Gupta", employeeId: "DEMO-1005", jobTitle: "Learning Designer", department: "Academics", teams: ["SkillCampus"] },
  { fullName: "Meera Nair", employeeId: "DEMO-1006", jobTitle: "Marketing Manager", department: "Marketing", teams: ["WeGrow", "BSchool"] },
  { fullName: "Rohan Mehta", employeeId: "DEMO-1007", jobTitle: "Data Analyst", department: "Operations", teams: ["SkillCampus"] },
  { fullName: "Sana Khan", employeeId: "DEMO-1008", jobTitle: "Program Manager", department: "Academics", teams: ["SkillCampus", "BSchool"] },
  { fullName: "Arjun Iyer", employeeId: "DEMO-1009", jobTitle: "Finance Associate", department: "Finance", teams: ["WeGrow"] },
  { fullName: "Tara Joshi", employeeId: "DEMO-1010", jobTitle: "Campus Coordinator", department: "Admissions", teams: ["BSchool"] },
];
const sharedChannels = [
  ["announcements", "Official updates for the organization. Only admins can post."],
  ["general", "Everyday conversation for the team."],
];
const initialOrganizationChannels = [
  ["WeGrow", "WG", "bg-green-700 text-white", "wg", "hr-help", "Questions about leave, payroll and policies."],
  ["SkillCampus", "SC", "bg-amber-800 text-white", "sc", "batches", "Batch schedules, trainers and labs."],
  ["BSchool", "BS", "bg-blue-900 text-white", "bs", "admissions", "Leads, counselling and admissions."],
].map(([organization, initials, avatarClass, prefix, extraName, extraDescription]) => ({
  organization,
  initials,
  avatarClass,
  channels: [
    ...sharedChannels.map(([name, description]) => ({
      id: `${prefix}-${name}`,
      name,
      description,
    })),
    {
      id: `${prefix}-${extraName}`,
      name: extraName,
      description: extraDescription,
    },
  ],
}));
const channelColors = {
  WeGrow: "border-green-700 bg-green-700 text-white",
  SkillCampus: "border-amber-800 bg-amber-800 text-white",
  BSchool: "border-blue-900 bg-blue-900 text-white",
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getChannelClass = (channel) => channelColors[channel] || "border-slate-300 bg-slate-200 text-slate-700";
const getPresenceColor = (status, fallback = "bg-emerald-500") => presenceColors[status] || fallback;
const getEmployeeTeams = (employee) => (Array.isArray(employee.teams) ? employee.teams : []);
const getLocalDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const TextField = memo(function TextField({ name, label, placeholder, type = "text", value = "", error, onChange }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required
        aria-invalid={Boolean(error)}
        placeholder={placeholder}
        className={inputClass}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

function AccountField({ label, value, onChange, type = "text", autoComplete }) {
  return (
    <label className="block text-xs font-medium text-slate-700">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
        required
      />
    </label>
  );
}

function AccountFormActions({ onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-2 pt-1">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
      >
        {submitLabel}
      </button>
    </div>
  );
}

function MainNavigation({ compact = false, activePage, onNavigate }) {
  return (
    <nav
      aria-label="Main navigation"
      className={compact
        ? "flex gap-1 overflow-x-auto border-b border-slate-200 bg-white px-2 py-2 lg:hidden"
        : "space-y-1"}
    >
      {navigationItems.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          disabled={!["People", "Files", "Admin"].includes(label)}
          aria-current={activePage === label ? "page" : undefined}
          aria-disabled={!["People", "Files", "Admin"].includes(label)}
          title={["People", "Files", "Admin"].includes(label) ? label : `${label} is not available in this prototype`}
          onClick={() => onNavigate(label)}
          className={`flex ${
            compact
              ? "shrink-0 px-3 py-2 text-[10px]"
                : "w-full px-3 py-2.5 text-left text-xs"
          } flex-col items-center gap-1 rounded-lg font-medium ${
            activePage === label
              ? "bg-violet-100 text-violet-800"
                : `${compact ? "text-slate-500" : "text-slate-600"} hover:bg-slate-50 disabled:cursor-not-allowed`
          }`}
        >
          <Icon size={compact ? 20 : 22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function OrganizationBadge({ organization }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getChannelClass(organization)}`}
    >
      {organization}
    </span>
  );
}

function PeopleProfileCard({ employee, index, onChat, onMeet }) {
  const initials = employee.fullName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const statusColor =
    employee.status === "Available"
      ? "bg-emerald-500"
      : employee.status === "Be right back"
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <article className="flex min-h-68 flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
      <span className="relative flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full">
          {employee.photo ? (
            <img src={employee.photo} alt="" className="h-full w-full rounded-full object-cover" />
          ) : (
            <span className={`flex h-full w-full items-center justify-center rounded-full text-2xl font-bold text-white ${peopleAvatarColors[index % peopleAvatarColors.length]}`}>
              {initials}
            </span>
          )}
          <span
            className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ${statusColor}`}
            role="img"
            aria-label={`${employee.status === "Available" ? "Online" : employee.status === "Be right back" ? "Away" : "Offline"}`}
            title={employee.status}
          />
      </span>
      <div className="mt-3 min-w-0 w-full">
        <h2 className="truncate text-lg font-semibold text-slate-900">
          {employee.fullName}
          {employee.isSelf && <span className="ml-1 font-normal text-slate-500">(you)</span>}
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{employee.jobTitle}</p>
        <p className="mt-0.5 truncate text-sm text-slate-500">{employee.department}</p>
      </div>

      <div className="mt-3 flex min-h-6 flex-wrap justify-center gap-1.5">
        {getEmployeeTeams(employee).map((organization) => (
          <OrganizationBadge key={organization} organization={organization} />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <button
          type="button"
          onClick={() => onChat(employee)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <MessageSquare size={14} aria-hidden="true" />
          Chat
        </button>
        <button
          type="button"
          onClick={() => onMeet(employee)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
        >
          <CalendarDays size={14} aria-hidden="true" />
          Meet
        </button>
      </div>
    </article>
  );
}

function PeoplePage({ employees, admin, onChat, onMeet }) {
  const [search, setSearch] = useState("");
  const [organizationFilter, setOrganizationFilter] = useState("Everyone");
  const people = useMemo(
    () => [
      { ...admin, isSelf: true },
      ...peopleSampleProfiles,
      ...employees,
    ],
    [admin, employees],
  );
  const filteredPeople = people.filter((employee) => {
    const matchesOrganization =
      organizationFilter === "Everyone" || getEmployeeTeams(employee).includes(organizationFilter);
    const searchableText = [
      employee.fullName,
      employee.jobTitle,
      employee.department,
      employee.employeeId,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return matchesOrganization && searchableText.includes(search.trim().toLowerCase());
  });

  return (
    <section aria-labelledby="people-heading">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="people-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            People
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Your colleagues across WeGrow, SkillCampus and BSchool.
          </p>
        </div>
        <label className="relative block w-full sm:max-w-sm">
          <span className="sr-only">Search by name, title or ID</span>
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, title or ID"
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
          />
        </label>
      </header>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter people by organization">
        {peopleFilters.map((filter) => (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={organizationFilter === filter}
            onClick={() => setOrganizationFilter(filter)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-violet-300 ${
              organizationFilter === filter
                ? "bg-violet-600 text-white"
                : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredPeople.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredPeople.map((employee, index) => (
            <PeopleProfileCard
              key={`${employee.employeeId}-${employee.fullName}`}
              employee={employee}
              index={index}
              onChat={onChat}
              onMeet={onMeet}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-12 text-center">
          <ContactRound size={28} className="mx-auto text-slate-400" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-slate-700">No people found</p>
          <p className="mt-1 text-xs text-slate-500">Try another name, title, employee ID or organization.</p>
        </div>
      )}
    </section>
  );
}

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileAvatarColor(name) {
  const hash = Array.from(name).reduce((value, character) => value + character.charCodeAt(0), 0);
  return fileAvatarColors[hash % fileAvatarColors.length];
}

function FilesPage({ files, onUpload, onDownload, onDelete }) {
  const [search, setSearch] = useState("");
  const uploadInputRef = useRef(null);
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleFileSelection = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length) onUpload(selectedFiles);
    event.target.value = "";
  };

  return (
    <section aria-labelledby="files-heading">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="files-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            Files
          </h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Everything shared in the channels you belong to.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <label className="relative block w-full sm:w-64">
            <span className="sr-only">Filter files</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Filter files"
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>
          <input
            ref={uploadInputRef}
            type="file"
            multiple
            onChange={handleFileSelection}
            className="sr-only"
            aria-label="Choose files to upload"
          />
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <Upload size={16} aria-hidden="true" />
            Upload files
          </button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr className="text-xs font-semibold text-slate-500">
              <th scope="col" className="px-4 py-3">Name</th>
              <th scope="col" className="px-4 py-3">Shared in</th>
              <th scope="col" className="px-4 py-3">Shared by</th>
              <th scope="col" className="px-4 py-3">Date</th>
              <th scope="col" className="px-4 py-3 text-right">Size</th>
              <th scope="col" className="px-4 py-3 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFiles.map((file) => (
              <tr key={file.id} className="text-sm text-slate-900 transition hover:bg-slate-50/70">
                <td className="px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white ${
                      fileTypeColors[file.type] || "bg-indigo-600"
                    }`}>
                      {["csv", "xls", "xlsx"].includes(file.type)
                        ? <FileSpreadsheet size={20} aria-hidden="true" />
                        : <FileText size={20} aria-hidden="true" />}
                    </span>
                    <span className="truncate font-medium text-slate-900" title={file.name}>{file.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800">
                    #{file.channel}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5">
                  <span className="inline-flex items-center gap-2">
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white ${getFileAvatarColor(file.sharedBy)}`} aria-hidden="true">
                      {file.sharedByInitials}
                    </span>
                    <span>{file.sharedBy}</span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3.5 text-slate-700">{file.date}</td>
                <td className="whitespace-nowrap px-4 py-3.5 text-right text-slate-700">{file.size}</td>
                <td className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onDownload(file)}
                      aria-label={`Download ${file.name}`}
                      title={`Download ${file.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-violet-50 hover:text-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <Download size={17} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(file)}
                      aria-label={`Delete ${file.name}`}
                      title={`Delete ${file.name}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredFiles.length && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <FileText size={28} className="mx-auto text-slate-400" aria-hidden="true" />
                  <p className="mt-3 text-sm font-medium text-slate-700">
                    {files.length ? "No files match your search" : "No files shared yet"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {files.length ? "Try a different file name." : "Upload a file to add it to this list."}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const generatePassword = (fullName) => {
  const baseName = String(fullName ?? "").trim().split(/\s+/)[0] || "User";
  return `${baseName}@${Math.floor(1000 + Math.random() * 9000)}`;
};

function App() {
  const [activePage, setActivePage] = useState("Admin");
  const [formData, setFormData] = useState(createEmptyFormData);
  const [password, setPassword] = useState("User@1234");
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [sharedFiles, setSharedFiles] = useState(initialSharedFiles);
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [accountAction, setAccountAction] = useState(null);
  const [adminName, setAdminName] = useState("WeGrow Admin");
  const [adminEmployeeId, setAdminEmployeeId] = useState("WG-0001");
  const [adminEmail, setAdminEmail] = useState("admin@wegrow.in");
  const [adminJobTitle, setAdminJobTitle] = useState("Administrator");
  const [adminDepartment, setAdminDepartment] = useState("Administration");
  const [profileDraft, setProfileDraft] = useState({ name: "WeGrow Admin", employeeId: "WG-0001" });
  const [adminTableDraft, setAdminTableDraft] = useState({
    name: "WeGrow Admin",
    email: "admin@wegrow.in",
    employeeId: "WG-0001",
    jobTitle: "Administrator",
    department: "Administration",
  });
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminPasswordReset, setIsAdminPasswordReset] = useState(false);
  const [currentAdminPassword, setCurrentAdminPassword] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [confirmAdminPassword, setConfirmAdminPassword] = useState("");
  const [accountFeedback, setAccountFeedback] = useState("");
  const [accountError, setAccountError] = useState("");
  const [presence, setPresence] = useState("Available");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusMessageDraft, setStatusMessageDraft] = useState("");
  const [theme, setTheme] = useState("Match my device");
  const [sampleDataFeedback, setSampleDataFeedback] = useState("");
  const [selectedEmployeeIndex, setSelectedEmployeeIndex] = useState(null);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [employeeDraft, setEmployeeDraft] = useState(null);
  const [employeeEditError, setEmployeeEditError] = useState("");
  const channels = defaultChannels;
  const [organizationChannels, setOrganizationChannels] = useState(initialOrganizationChannels);
  const [isChannelModalOpen, setIsChannelModalOpen] = useState(false);
  const [newChannel, setNewChannel] = useState({
    organization: defaultChannels[0],
    name: "",
    description: "",
  });
  const [newChannelError, setNewChannelError] = useState("");
  const [activeChatEmployee, setActiveChatEmployee] = useState(null);
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [meetingEmployee, setMeetingEmployee] = useState(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDateTime, setMeetingDateTime] = useState("");
  const [meetingMinimumDateTime, setMeetingMinimumDateTime] = useState("");
  const [meetingScheduled, setMeetingScheduled] = useState(null);
  const globalSearchRef = useRef(null);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
        event.preventDefault();
        globalSearchRef.current?.focus();
      }
      if (event.key === "Escape") {
        setIsProfileMenuOpen(false);
        setGlobalSearch("");
        setAccountAction(null);
      }
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      document.documentElement.dataset.theme =
        theme === "Match my device" ? (mediaQuery.matches ? "dark" : "light") : theme.toLowerCase();
    };

    applyTheme();
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
  }, [theme]);

  const handleGeneratePassword = () => setPassword(generatePassword(formData.fullName));
  const openAdminPasswordDialog = (isReset = false) => {
    setCurrentAdminPassword("");
    setNewAdminPassword("");
    setConfirmAdminPassword("");
    setAccountError("");
    setIsAdminPasswordReset(isReset);
    setAccountAction("password");
  };

  const handleFormChange = ({ target }) => {
    const { name, value } = target;
    if (name) {
      setFormData((current) => ({ ...current, [name]: value }));
      setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formDataObject = new FormData(event.currentTarget);
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!String(formDataObject.get(field) ?? "").trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    const workEmail = String(formDataObject.get("workEmail") ?? "").trim();
    if (workEmail && !emailPattern.test(workEmail)) {
      nextErrors.workEmail = "Enter a valid work email address.";
    }

    if (!formDataObject.getAll("teams").length) {
      nextErrors.teams = "Select at least one channel.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const employee = {
      fullName: String(formDataObject.get("fullName") ?? "").trim(),
      workEmail,
      employeeId: String(formDataObject.get("employeeId") ?? "").trim(),
      jobTitle: String(formDataObject.get("jobTitle") ?? "").trim(),
      department: String(formDataObject.get("department") ?? "").trim(),
      role: String(formDataObject.get("role") ?? "Employee"),
      teams: formDataObject.getAll("teams").map(String),
      createdAt: new Date().toISOString(),
      photo: "",
      status: "Available",
    };

    setEmployees((currentEmployees) => [...currentEmployees, employee]);
    event.currentTarget.reset();
    setFormData(createEmptyFormData());
    setErrors({});
  };

  const handleProfileUpload = (index, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEmployees((currentEmployees) =>
        currentEmployees.map((employee, employeeIndex) =>
          employeeIndex === index ? { ...employee, photo: String(reader.result) } : employee,
        ),
      );
    };
    reader.readAsDataURL(file);
  };

  const handleEmployeeEdit = (employee = selectedEmployee) => {
    if (!canEditEmployees || !employee) return;
    setEmployeeDraft({ ...employee, teams: [...getEmployeeTeams(employee)] });
    setEmployeeEditError("");
    setIsEditingEmployee(true);
  };

  const handleEmployeeSave = (event) => {
    event.preventDefault();
    if (!canEditEmployees) return;
    if (!employeeDraft || selectedEmployeeIndex === null) return;

    const updatedEmployee = {
      ...employeeDraft,
      fullName: employeeDraft.fullName.trim(),
      workEmail: employeeDraft.workEmail.trim(),
      employeeId: employeeDraft.employeeId.trim(),
      jobTitle: employeeDraft.jobTitle.trim(),
      department: employeeDraft.department.trim(),
    };

    if (
      !updatedEmployee.fullName ||
      !updatedEmployee.workEmail ||
      !updatedEmployee.employeeId ||
      !updatedEmployee.jobTitle ||
      !updatedEmployee.department
    ) {
      setEmployeeEditError("Please fill in all required fields.");
      return;
    }
    if (!emailPattern.test(updatedEmployee.workEmail)) {
      setEmployeeEditError("Enter a valid work email address.");
      return;
    }
    if (!getEmployeeTeams(updatedEmployee).length) {
      setEmployeeEditError("Select at least one channel.");
      return;
    }

    setEmployees((currentEmployees) =>
      currentEmployees.map((employee, index) =>
        index === selectedEmployeeIndex ? updatedEmployee : employee,
      ),
    );
    setIsEditingEmployee(false);
    setEmployeeDraft(null);
    setEmployeeEditError("");
  };

  const closeEmployeeProfile = () => {
    setSelectedEmployeeIndex(null);
    setIsEditingEmployee(false);
    setEmployeeDraft(null);
    setEmployeeEditError("");
  };

  const handleChannelSubmit = (event) => {
    event.preventDefault();
    const organization = newChannel.organization;
    const name = newChannel.name.trim().replace(/\s+/g, "-").replace(/^#+/, "");
    const description = newChannel.description.trim();

    if (!organization || !name || !description) {
      setNewChannelError("Organization, channel name, and description are required.");
      return;
    }

    const exists = organizationChannels
      .find((item) => item.organization === organization)
      ?.channels.some((channel) => channel.name.toLowerCase() === name.toLowerCase());

    if (exists) {
      setNewChannelError("That channel already exists for this organization.");
      return;
    }

    setOrganizationChannels((currentOrganizations) =>
      currentOrganizations.map((item) =>
        item.organization === organization
          ? {
              ...item,
              channels: [
                ...item.channels,
                { id: crypto.randomUUID(), name, description },
              ],
            }
          : item,
      ),
    );

    setIsChannelModalOpen(false);
    setNewChannel({ organization: defaultChannels[0], name: "", description: "" });
    setNewChannelError("");
  };

  const handleChannelDelete = (organization, channel) => {
    if (!window.confirm(`Delete #${channel.name} from ${organization}?`)) return;

    setOrganizationChannels((currentOrganizations) =>
      currentOrganizations.map((item) =>
        item.organization === organization
          ? { ...item, channels: item.channels.filter((entry) => entry.id !== channel.id) }
          : item,
      ),
    );
  };

  const handleChatSubmit = (event) => {
    event.preventDefault();
    const message = chatDraft.trim();
    if (!message || !activeChatEmployee) return;

    setChatMessages((currentMessages) => ({
      ...currentMessages,
      [activeChatEmployee.employeeId]: [
        ...(currentMessages[activeChatEmployee.employeeId] || []),
        { id: crypto.randomUUID(), message, sentAt: new Date().toISOString() },
      ],
    }));
    setChatDraft("");
  };

  const openChat = (employee) => {
    setChatDraft("");
    setActiveChatEmployee(employee);
  };

  const openMeeting = (employee) => {
    setMeetingTitle(`Meet with ${employee.fullName}`);
    setMeetingDateTime("");
    setMeetingMinimumDateTime(getLocalDateTime());
    setMeetingScheduled(null);
    setMeetingEmployee(employee);
  };

  const handleMeetingSubmit = (event) => {
    event.preventDefault();
    if (!meetingEmployee) return;

    setMeetingScheduled({
      employee: meetingEmployee.fullName,
      title: meetingTitle.trim(),
      dateTime: meetingDateTime,
    });
  };

  const handleFilesUpload = (uploadedFiles) => {
    const sharedAt = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const initials = adminName
      .split(/\s+/)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    setSharedFiles((currentFiles) => [
      ...uploadedFiles.map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        channel: "general",
        sharedBy: adminName,
        sharedByInitials: initials,
        date: sharedAt,
        size: formatFileSize(file.size),
        type: file.name.split(".").pop()?.toLowerCase() || "",
        file,
      })),
      ...currentFiles,
    ]);
  };

  const handleFileDownload = (file) => {
    const blob = file.file instanceof Blob
      ? file.file
      : new Blob([file.content], {
          type: file.type === "csv" ? "text/csv;charset=utf-8" : "text/plain;charset=utf-8",
        });
    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = file.name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
  };

  const handleFileDelete = (file) => {
    if (!window.confirm(`Delete "${file.name}"?`)) return;
    setSharedFiles((currentFiles) => currentFiles.filter((entry) => entry.id !== file.id));
  };

  const handleAddSampleData = () => {
    if (employees.some((employee) => employee.isSample)) {
      setSampleDataFeedback("Sample data has already been added.");
      return;
    }

    const createdAt = new Date().toISOString();
    setEmployees((currentEmployees) => [
      ...currentEmployees,
      ...sampleColleagues.map((colleague) => ({
        ...colleague,
        workEmail: `${colleague.fullName.toLowerCase().replace(/\s+/g, ".")}@example.test`,
        role: "Employee",
        createdAt,
        photo: "",
        isSample: true,
        status: "Available",
      })),
    ]);
    setSampleDataFeedback("Added 10 sample colleagues.");
  };

  const handleRemoveSampleData = () => {
    const selectedEmployee = selectedEmployeeIndex === null ? null : employees[selectedEmployeeIndex];
    if (selectedEmployee?.isSample) closeEmployeeProfile();

    const remainingEmployees = employees.filter((employee) => !employee.isSample);
    const sampleCount = employees.length - remainingEmployees.length;
    setEmployees(remainingEmployees);
    setSampleDataFeedback(
      sampleCount ? `Removed ${sampleCount} sample ${sampleCount === 1 ? "colleague" : "colleagues"}.` : "There is no sample data to remove.",
    );
  };

  const openChannelModal = () => {
    setNewChannel({ organization: defaultChannels[0], name: "", description: "" });
    setNewChannelError("");
    setIsChannelModalOpen(true);
  };

  const employeeCountLabel = `${employees.length + 1} ${employees.length === 0 ? "employee" : "employees"}`;
  const canEditEmployees = adminName === "WeGrow Admin" && adminEmployeeId === "WG-0001";
  const selectedEmployee =
    selectedEmployeeIndex === null ? null : employees[selectedEmployeeIndex] ?? null;
  const normalizedEmployeeSearch = employeeSearch.trim().toLowerCase();
  const adminMatchesSearch = useMemo(
    () =>
      [
        adminName,
        adminEmail,
        adminEmployeeId,
        adminJobTitle,
        adminDepartment,
        "Admin",
        presence,
        ...defaultChannels,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedEmployeeSearch),
    [
      adminName,
      adminEmail,
      adminEmployeeId,
      adminJobTitle,
      adminDepartment,
      presence,
      normalizedEmployeeSearch,
    ],
  );
  const filteredEmployees = useMemo(
    () =>
      employees
        .map((employee, index) => ({ employee, index }))
        .filter(({ employee }) =>
          [
            employee.fullName,
            employee.workEmail,
            employee.employeeId,
            employee.jobTitle,
            employee.department,
            employee.role,
            ...getEmployeeTeams(employee),
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedEmployeeSearch),
        ),
    [employees, normalizedEmployeeSearch],
  );
  const normalizedGlobalSearch = globalSearch.trim().toLowerCase();
  const globalSearchResults = useMemo(
    () =>
      normalizedGlobalSearch
        ? [
            ...employees
              .map((employee, index) => ({ type: "person", employee, index }))
              .filter(({ employee }) =>
                [employee.fullName, employee.workEmail, employee.employeeId, employee.jobTitle]
                  .join(" ")
                  .toLowerCase()
                  .includes(normalizedGlobalSearch),
              ),
            ...organizationChannels.flatMap((organization) =>
              organization.channels
                .filter((channel) =>
                  `${organization.organization} ${channel.name} ${channel.description}`
                    .toLowerCase()
                    .includes(normalizedGlobalSearch),
                )
                .map((channel) => ({ type: "channel", organization, channel })),
            ),
          ].slice(0, 6)
        : [],
    [employees, organizationChannels, normalizedGlobalSearch],
  );
  const presenceColor = getPresenceColor(presence, "bg-slate-400");
  const peopleAdmin = {
    fullName: adminName,
    employeeId: adminEmployeeId,
    jobTitle: adminJobTitle,
    department: "Management",
    teams: defaultChannels,
    status: presence,
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-3 px-3 py-3 sm:px-5 lg:flex-nowrap">
          <div className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo.png"
              alt="WeGrow Skill Campus and BSchool"
              width={450}
              height={132}
              className="h-9 w-auto object-contain"
            />
            <span className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">ConnectX</span>
          </div>

          <div className="relative order-3 w-full lg:order-none lg:mx-auto lg:max-w-xl">
            <label className="sr-only" htmlFor="global-search">Search people, messages and channels</label>
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              id="global-search"
              ref={globalSearchRef}
              type="search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Search people, messages and channels"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-16 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
              aria-controls="global-search-results"
              aria-expanded={Boolean(normalizedGlobalSearch)}
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
              Ctrl E
            </kbd>
            {normalizedGlobalSearch && (
              <div
                id="global-search-results"
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                role="listbox"
                aria-label="Search results"
              >
                {globalSearchResults.length ? (
                  globalSearchResults.map((result) =>
                    result.type === "person" ? (
                      <button
                        key={`person-${result.employee.employeeId}`}
                        type="button"
                        role="option"
                        aria-selected="false"
                        onClick={() => {
                          setSelectedEmployeeIndex(result.index);
                          setGlobalSearch("");
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-violet-50"
                      >
                        <ContactRound size={15} className="text-violet-600" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-slate-800">{result.employee.fullName}</span>
                          <span className="block truncate text-[10px] text-slate-500">{result.employee.workEmail}</span>
                        </span>
                      </button>
                    ) : (
                      <button
                        key={`channel-${result.channel.id}`}
                        type="button"
                        role="option"
                        aria-selected="false"
                        onClick={() => {
                          setGlobalSearch("");
                          document.getElementById("channels-heading")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left hover:bg-violet-50"
                      >
                        <UsersRound size={15} className="text-violet-600" aria-hidden="true" />
                        <span className="min-w-0">
                          <span className="block truncate text-xs font-medium text-slate-800">#{result.channel.name}</span>
                          <span className="block truncate text-[10px] text-slate-500">{result.organization.organization}</span>
                        </span>
                      </button>
                    ),
                  )
                ) : (
                  <p className="px-2.5 py-3 text-xs text-slate-500">No people or channels found.</p>
                )}
              </div>
            )}
          </div>

          <div className="relative ml-auto flex shrink-0 items-center">
            {isProfileMenuOpen && (
              <button
                type="button"
                className="fixed inset-0 z-40 cursor-default"
                aria-label="Close profile settings"
                onClick={() => setIsProfileMenuOpen(false)}
              />
            )}
            <button
              type="button"
              onClick={() => {
                setStatusMessageDraft(statusMessage);
                setIsProfileMenuOpen((open) => !open);
              }}
              aria-label={`Open user profile settings. Status: ${presence}`}
              aria-haspopup="dialog"
              aria-expanded={isProfileMenuOpen}
              className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white ring-1 ring-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              WA
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${presenceColor}`}
                aria-label={`Status: ${presence}`}
              />
            </button>

            {isProfileMenuOpen && (
              <section
                role="dialog"
                aria-label="User profile settings"
                className="absolute right-0 top-full z-50 mt-2 max-h-[calc(100vh-5rem)] w-[min(22rem,calc(100vw-1.5rem))] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-700 text-base font-bold text-white">WA</span>
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-slate-900">{adminName}</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Employee ID: {adminEmployeeId}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{statusMessage || "Set a status message"}</p>
                  </div>
                </div>

                <fieldset className="border-b border-slate-100 py-3">
                  <legend className="mb-2 text-sm font-semibold text-slate-700">Set status</legend>
                  <div className="space-y-1">
                    {presenceOptions.map((option) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setPresence(option.label)}
                        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                        aria-pressed={presence === option.label}
                      >
                        <span className={`h-3.5 w-3.5 rounded-full ${option.color}`} aria-hidden="true" />
                        <span className="flex-1">{option.label}</span>
                        {presence === option.label && <Check size={18} className="text-violet-600" aria-label="Selected" />}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <form
                  className="border-b border-slate-100 py-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setStatusMessage(statusMessageDraft.trim());
                  }}
                >
                  <label htmlFor="status-message" className="mb-2 block text-xs font-semibold text-slate-700">
                    Status message
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="status-message"
                      value={statusMessageDraft}
                      onChange={(event) => setStatusMessageDraft(event.target.value)}
                      maxLength={100}
                      placeholder="Share a quick update"
                      className="min-w-0 flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-xs outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <fieldset className="border-b border-slate-100 py-3">
                  <legend className="mb-2 text-xs font-semibold text-slate-700">Theme</legend>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["Match my device", "Light", "Dark"].map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setTheme(option)}
                        aria-pressed={theme === option}
                        className={`rounded-md border px-2 py-1.5 text-[10px] font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 ${
                          theme === option
                            ? "border-violet-300 bg-violet-50 text-violet-800"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="pt-3">
                  <h3 className="mb-2 text-xs font-semibold text-slate-700">Account</h3>
                  <div className="rounded-md bg-slate-50 px-2.5 py-2 text-xs text-slate-600">
                    {adminName} <span className="text-slate-400">·</span> {adminEmployeeId}
                  </div>
                  <div className="mt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDraft({ name: adminName, employeeId: adminEmployeeId });
                        setAccountError("");
                        setAccountAction("profile");
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <UserRoundPen size={15} aria-hidden="true" />
                      Change profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openAdminPasswordDialog();
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <KeyRound size={15} aria-hidden="true" />
                      Change password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAccountFeedback("Sign out is not connected in this prototype.");
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      <LogOut size={15} aria-hidden="true" />
                      Sign out
                    </button>
                  </div>
                  {accountFeedback && (
                    <p className="mt-2 text-[11px] text-slate-500" role="status" aria-live="polite">
                      {accountFeedback}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </header>

      {accountAction && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setAccountAction(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-action-heading"
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <h2 id="account-action-heading" className="text-base font-semibold text-slate-900">
                {accountAction === "profile" ? "Change profile" : "Change password"}
              </h2>
              <button
                type="button"
                onClick={() => setAccountAction(null)}
                aria-label="Close dialog"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            {accountAction === "admin-profile" ? (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const { name, email, employeeId, jobTitle, department } = adminTableDraft;
                  if (![name, email, employeeId, jobTitle, department].every((value) => value.trim())) {
                    setAccountError("All admin details are required.");
                    return;
                  }
                  if (!emailPattern.test(email.trim())) {
                    setAccountError("Enter a valid work email address.");
                    return;
                  }
                  setAdminName(name.trim());
                  setAdminEmail(email.trim());
                  setAdminEmployeeId(employeeId.trim());
                  setAdminJobTitle(jobTitle.trim());
                  setAdminDepartment(department.trim());
                  setAccountFeedback("Admin details updated for this browser session.");
                  setAccountError("");
                  setAccountAction(null);
                  setIsProfileMenuOpen(true);
                }}
              >
                {[
                  ["name", "Name"],
                  ["email", "Email"],
                  ["employeeId", "Employee ID"],
                  ["jobTitle", "Title"],
                  ["department", "Department"],
                ].map(([field, label]) => (
                  <AccountField
                    key={field}
                    label={label}
                    value={adminTableDraft[field]}
                    onChange={(event) =>
                      setAdminTableDraft((current) => ({ ...current, [field]: event.target.value }))
                    }
                    type={field === "email" ? "email" : "text"}
                  />
                ))}
                {accountError && <p className="text-xs text-red-600" role="alert">{accountError}</p>}
                <AccountFormActions onCancel={() => setAccountAction(null)} submitLabel="Save admin details" />
              </form>
            ) : accountAction === "profile" ? (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  const name = profileDraft.name.trim();
                  const employeeId = profileDraft.employeeId.trim();
                  if (!name || !employeeId) {
                    setAccountError("Name and employee ID are required.");
                    return;
                  }
                  setAdminName(name);
                  setAdminEmployeeId(employeeId);
                  setAccountFeedback("Profile updated for this browser session.");
                  setAccountError("");
                  setAccountAction(null);
                  setIsProfileMenuOpen(true);
                }}
              >
                <AccountField
                  label="Name"
                  value={profileDraft.name}
                  onChange={(event) =>
                    setProfileDraft((current) => ({ ...current, name: event.target.value }))
                  }
                />
                <AccountField
                  label="Employee ID"
                  value={profileDraft.employeeId}
                  onChange={(event) =>
                    setProfileDraft((current) => ({ ...current, employeeId: event.target.value }))
                  }
                />
                {accountError && <p className="text-xs text-red-600" role="alert">{accountError}</p>}
                <AccountFormActions onCancel={() => setAccountAction(null)} submitLabel="Save profile" />
              </form>
            ) : (
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!isAdminPasswordReset && adminPassword && currentAdminPassword !== adminPassword) {
                    setAccountError("Current password is incorrect.");
                    return;
                  }
                  if (newAdminPassword !== confirmAdminPassword) {
                    setAccountError("The passwords do not match.");
                    return;
                  }
                  setAdminPassword(newAdminPassword);
                  setAccountFeedback(
                    `${isAdminPasswordReset ? "Password reset" : "Password updated"} for this browser session.`,
                  );
                  setAccountError("");
                  setAccountAction(null);
                  setIsProfileMenuOpen(true);
                }}
              >
                <p className="text-xs leading-5 text-slate-500">
                  {isAdminPasswordReset ? "Set a new password for the admin account." : "Password changes are stored only for this prototype session and are not connected to a sign-in service."}
                </p>
                {adminPassword && !isAdminPasswordReset && (
                  <AccountField
                    label="Current password"
                    type="password"
                    value={currentAdminPassword}
                    onChange={(event) => setCurrentAdminPassword(event.target.value)}
                    autoComplete="current-password"
                  />
                )}
                <AccountField
                  label="New password"
                  type="password"
                  value={newAdminPassword}
                  onChange={(event) => setNewAdminPassword(event.target.value)}
                  autoComplete="new-password"
                />
                <AccountField
                  label="Confirm new password"
                  type="password"
                  value={confirmAdminPassword}
                  onChange={(event) => setConfirmAdminPassword(event.target.value)}
                  autoComplete="new-password"
                />
                {accountError && <p className="text-xs text-red-600" role="alert">{accountError}</p>}
                <AccountFormActions
                  onCancel={() => setAccountAction(null)}
                  submitLabel={isAdminPasswordReset ? "Reset password" : "Save password"}
                />
              </form>
            )}
          </section>
        </div>
      )}

      <MainNavigation compact activePage={activePage} onNavigate={setActivePage} />

      <aside className="fixed bottom-0 left-0 top-[65px] z-30 hidden w-24 border-r border-slate-200 bg-white px-2 py-5 lg:block">
        <MainNavigation activePage={activePage} onNavigate={setActivePage} />
      </aside>

      <main className="px-3 pb-6 pt-6 sm:px-4 lg:ml-24 lg:px-6">
        <div className={`mx-auto ${["People", "Files"].includes(activePage) ? "max-w-7xl" : "max-w-5xl"}`}>
        {activePage === "People" ? (
          <PeoplePage
            employees={employees}
            admin={peopleAdmin}
            onChat={openChat}
            onMeet={openMeeting}
          />
        ) : activePage === "Files" ? (
          <FilesPage
            files={sharedFiles}
            onUpload={handleFilesUpload}
            onDownload={handleFileDownload}
            onDelete={handleFileDelete}
          />
        ) : (
          <>
        <header className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            Create employee logins, choose which teams they see, and manage channels.
          </p>
        </header>

        <main className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Create an employee login</h2>

          <form noValidate onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              {identityFields.map((field) => (
                <TextField
                  key={field.name}
                  {...field}
                  value={formData[field.name] ?? ""}
                  error={errors[field.name]}
                  onChange={handleFormChange}
                />
              ))}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-700">
                  Temporary password
                </label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                  <input
                    id="password"
                    name="password"
                    type="text"
                    value={password}
                    readOnly
                    required
                    className="w-full bg-transparent text-xs text-slate-900 outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="rounded-md bg-violet-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    New
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="role" className="mb-1.5 block text-xs font-medium text-slate-700">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleFormChange}
                  required
                  className={inputClass}
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {employeeFields.map((field) => (
                <TextField
                  key={field.name}
                  {...field}
                  value={formData[field.name] ?? ""}
                  error={errors[field.name]}
                  onChange={handleFormChange}
                />
              ))}
            </div>

            <div className="pt-1">
              <label className="mb-2 block text-xs font-medium text-slate-700">Channels they can access</label>
              <div className="flex flex-wrap gap-2">
                {channels.length === 0 ? (
                  <p className="text-xs text-slate-500">Add a channel to enable access.</p>
                ) : (
                  channels.map((channel) => (
                    <label
                      key={channel}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                    >
                      <input type="checkbox" name="teams" value={channel} className="h-3.5 w-3.5 accent-blue-600" />
                      <span>{channel}</span>
                    </label>
                  ))
                )}
              </div>
              {errors.teams && <p className="mt-2 text-xs text-red-600">{errors.teams}</p>}
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                Create login
              </button>
            </div>
          </form>
        </main>

        <section
          className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          aria-labelledby="employees-heading"
        >
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <h3 id="employees-heading" className="text-base font-semibold text-slate-900">
                Employees
              </h3>
              <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                {normalizedEmployeeSearch
                  ? `${filteredEmployees.length + Number(adminMatchesSearch)} of ${employeeCountLabel}`
                  : employeeCountLabel}
              </span>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <span className="sr-only">Search employees</span>
              <Search
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={employeeSearch}
                onChange={(event) => setEmployeeSearch(event.target.value)}
                placeholder="Search employees"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
              />
            </label>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-3 py-2 font-medium">Name</th>
                    <th scope="col" className="px-3 py-2 font-medium">Email</th>
                    <th scope="col" className="px-3 py-2 font-medium">Employee ID</th>
                    <th scope="col" className="px-3 py-2 font-medium">Title</th>
                    <th scope="col" className="px-3 py-2 font-medium">Department</th>
                    <th scope="col" className="px-3 py-2 font-medium">Teams</th>
                    <th scope="col" className="px-3 py-2 font-medium">Role</th>
                    <th scope="col" className="px-3 py-2 font-medium">Created date</th>
                    <th scope="col" className="px-3 py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {adminMatchesSearch && (
                    <tr className="bg-violet-50/50 text-slate-700 align-top">
                      <td className="whitespace-nowrap px-3 py-2">
                        <div className="flex items-center gap-2">
                          <span className="relative block h-8 w-8 shrink-0">
                            <span className="flex h-full w-full items-center justify-center rounded-full bg-green-700 text-[10px] font-semibold text-white">
                              WA
                            </span>
                            <span
                              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${presenceColor}`}
                              title={presence}
                              aria-label={`Status: ${presence}`}
                            />
                          </span>
                          <span className="font-medium text-slate-900">{adminName}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">{adminEmail}</td>
                      <td className="whitespace-nowrap px-3 py-2">{adminEmployeeId}</td>
                      <td className="whitespace-nowrap px-3 py-2">{adminJobTitle}</td>
                      <td className="whitespace-nowrap px-3 py-2">{adminDepartment}</td>
                      <td className="px-3 py-2">
                        <div className="flex min-w-24 flex-wrap gap-1">
                          {defaultChannels.map((team) => (
                            <span
                              key={team}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getChannelClass(team)}`}
                            >
                              {team}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-2">Admin</td>
                      <td className="whitespace-nowrap px-3 py-2">—</td>
                      <td className="whitespace-nowrap px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {canEditEmployees && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminTableDraft({
                                    name: adminName,
                                    email: adminEmail,
                                    employeeId: adminEmployeeId,
                                    jobTitle: adminJobTitle,
                                    department: adminDepartment,
                                  });
                                  setAccountError("");
                                  setAccountAction("admin-profile");
                                }}
                                className="inline-flex items-center gap-1 rounded-md border border-violet-200 px-2 py-1 text-[10px] font-medium text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                              >
                                <Pencil size={12} aria-hidden="true" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => openAdminPasswordDialog(true)}
                                className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                              >
                                <KeyRound size={12} aria-hidden="true" />
                                Reset password
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  {filteredEmployees.length ? (
                    filteredEmployees.map(({ employee, index }) => (
                      <tr key={`${employee.employeeId}-${index}`} className="text-slate-700 align-top">
                        <td className="whitespace-nowrap px-3 py-2">
                          <div className="flex items-center gap-2">
                            {employee.photo ? (
                              <span className="relative block h-8 w-8 shrink-0">
                                <img
                                  src={employee.photo}
                                  alt=""
                                  className="h-full w-full rounded-full object-cover"
                                />
                                <span
                                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${getPresenceColor(employee.status)}`}
                                  title={employee.status || "Available"}
                                  aria-label={`Status: ${employee.status || "Available"}`}
                                />
                              </span>
                            ) : (
                              <span className="relative block h-8 w-8 shrink-0">
                                <span
                                  className="flex h-full w-full items-center justify-center rounded-full bg-violet-100 text-[10px] font-semibold text-violet-700"
                                  aria-hidden="true"
                                >
                                  {employee.fullName ? employee.fullName.charAt(0).toUpperCase() : "A"}
                                </span>
                                <span
                                  className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${getPresenceColor(employee.status)}`}
                                  title={employee.status || "Available"}
                                  aria-label={`Status: ${employee.status || "Available"}`}
                                />
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeIndex(index)}
                              className="text-left font-medium text-slate-900 hover:text-violet-700 hover:underline focus:outline-none focus:underline"
                            >
                              {employee.fullName}
                            </button>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{employee.workEmail}</td>
                        <td className="whitespace-nowrap px-3 py-2">{employee.employeeId}</td>
                        <td className="whitespace-nowrap px-3 py-2">{employee.jobTitle}</td>
                        <td className="whitespace-nowrap px-3 py-2">{employee.department}</td>
                        <td className="px-3 py-2">
                          <div className="flex min-w-24 flex-wrap gap-1">
                            {getEmployeeTeams(employee).map((team) => (
                              <span
                                key={team}
                                className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getChannelClass(team)}`}
                              >
                                {team}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">{employee.role}</td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <time dateTime={employee.createdAt}>{new Date(employee.createdAt).toLocaleDateString()}</time>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedEmployeeIndex(index)}
                              className="rounded-md border border-slate-300 px-2 py-1 text-[10px] font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                            >
                              View
                            </button>
                            {canEditEmployees && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEmployeeIndex(index);
                                  handleEmployeeEdit(employee);
                                }}
                                className="rounded-md border border-violet-200 px-2 py-1 text-[10px] font-medium text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    employees.length === 0 && !normalizedEmployeeSearch ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-3 text-xs text-slate-500">
                          Created employee accounts will appear here.
                        </td>
                      </tr>
                    ) : !adminMatchesSearch ? (
                      <tr>
                        <td colSpan={9} className="px-3 py-6 text-center text-xs text-slate-500">
                          No employees match your search.
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
          </div>
        </section>

        {selectedEmployee && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={closeEmployeeProfile}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="employee-profile-heading"
              className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <label className="group relative block h-14 w-14 shrink-0 cursor-pointer overflow-hidden rounded-full focus-within:ring-2 focus-within:ring-violet-500 focus-within:ring-offset-2">
                    {selectedEmployee.photo ? (
                      <img
                        src={selectedEmployee.photo}
                        alt={`${selectedEmployee.fullName} profile`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-violet-100 text-lg font-semibold text-violet-700">
                        {selectedEmployee.fullName.charAt(0).toUpperCase()}
                      </span>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white ${getPresenceColor(selectedEmployee.status)}`}
                      title={selectedEmployee.status || "Available"}
                      aria-label={`Status: ${selectedEmployee.status || "Available"}`}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-center text-[9px] font-medium text-white opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                      {selectedEmployee.photo ? "Change photo" : "Upload photo"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      aria-label={selectedEmployee.photo ? "Change profile photo" : "Upload profile photo"}
                      className="absolute inset-0 cursor-pointer opacity-0"
                      onChange={(event) => handleProfileUpload(selectedEmployeeIndex, event)}
                    />
                  </label>
                  <div>
                    <h3 id="employee-profile-heading" className="text-lg font-semibold text-slate-900">
                      {selectedEmployee.fullName}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedEmployee.jobTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditingEmployee && canEditEmployees && (
                    <button
                      type="button"
                      onClick={handleEmployeeEdit}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={closeEmployeeProfile}
                    aria-label="Close profile details"
                    className="rounded-md px-2 py-1 text-lg leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  >
                    ×
                  </button>
                </div>
              </div>

              {!isEditingEmployee ? (
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium text-slate-500">Work email</dt>
                  <dd className="mt-0.5 break-all text-slate-900">{selectedEmployee.workEmail}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Employee ID</dt>
                  <dd className="mt-0.5 text-slate-900">{selectedEmployee.employeeId}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Job title</dt>
                  <dd className="mt-0.5 text-slate-900">{selectedEmployee.jobTitle}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Department</dt>
                  <dd className="mt-0.5 text-slate-900">{selectedEmployee.department}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Role</dt>
                  <dd className="mt-0.5 text-slate-900">{selectedEmployee.role}</dd>
                </div>
                <div>
                  <dt className="text-xs font-medium text-slate-500">Created date</dt>
                  <dd className="mt-0.5 text-slate-900">
                    <time dateTime={selectedEmployee.createdAt}>
                      {new Date(selectedEmployee.createdAt).toLocaleDateString()}
                    </time>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium text-slate-500">Channels</dt>
                  <dd className="mt-1 flex flex-wrap gap-1.5">
                    {getEmployeeTeams(selectedEmployee).map((channel) => (
                      <span
                        key={channel}
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getChannelClass(channel)}`}
                      >
                        {channel}
                      </span>
                    ))}
                  </dd>
                </div>
                </dl>
              ) : (
                <form onSubmit={handleEmployeeSave} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {[
                      ["fullName", "Full name"],
                      ["workEmail", "Work email"],
                      ["employeeId", "Employee ID"],
                      ["jobTitle", "Job title"],
                      ["department", "Department"],
                    ].map(([field, label]) => (
                      <label key={field} className="block text-xs font-medium text-slate-600">
                        {label}
                        <input
                          type="text"
                          value={employeeDraft[field]}
                          onChange={(event) =>
                            setEmployeeDraft((current) => ({ ...current, [field]: event.target.value }))
                          }
                          className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                      </label>
                    ))}
                    <label className="block text-xs font-medium text-slate-600">
                      Role
                      <select
                        value={employeeDraft.role}
                        onChange={(event) =>
                          setEmployeeDraft((current) => ({ ...current, role: event.target.value }))
                        }
                        className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      >
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </label>
                  </div>
                  <fieldset>
                    <legend className="mb-2 text-xs font-medium text-slate-600">Channels</legend>
                    <div className="flex flex-wrap gap-2">
                      {channels.map((channel) => (
                        <label
                          key={channel}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={employeeDraft.teams.includes(channel)}
                            onChange={(event) =>
                              setEmployeeDraft((current) => ({
                                ...current,
                                teams: event.target.checked
                                  ? [...current.teams, channel]
                                  : current.teams.filter((item) => item !== channel),
                              }))
                            }
                            className="accent-blue-600"
                          />
                          {channel}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {employeeEditError && <p className="text-xs text-red-600">{employeeEditError}</p>}
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingEmployee(false);
                        setEmployeeDraft(null);
                        setEmployeeEditError("");
                      }}
                      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              )}
            </section>
          </div>
        )}

        <section
          className="mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
          aria-labelledby="channels-heading"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 id="channels-heading" className="text-lg font-semibold text-slate-900">
              Channels
            </h2>
          </div>

          <div className="space-y-5">
            {organizationChannels.map((organization) => (
              <section key={organization.organization} aria-label={`${organization.organization} channels`}>
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${organization.avatarClass}`}
                    aria-hidden="true"
                  >
                    {organization.initials}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {organization.organization}
                  </h3>
                </div>

                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {organization.channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center gap-2 py-2.5 sm:gap-3"
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-500"
                        aria-hidden="true"
                      >
                        {channel.name === "announcements" ? "📣" : "#"}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h4 className="truncate text-xs font-semibold text-slate-800">
                          {channel.name}
                        </h4>
                        <p className="mt-0.5 text-xs leading-4 text-slate-500">
                          {channel.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChannelDelete(organization.organization, channel)}
                        className="shrink-0 rounded-md border border-black bg-white px-2.5 py-1 text-xs font-medium text-black transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {organization.channels.length === 0 && (
                    <p className="py-3 text-xs text-slate-500">No channels for this organization yet.</p>
                  )}
                </div>
              </section>
            ))}
          </div>

          <button
            type="button"
            onClick={openChannelModal}
            className="mt-5 inline-flex items-center rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <span aria-hidden="true" className="mr-1.5 text-base leading-none">+</span>
            New channel
          </button>
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">Sample data</h2>
          <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
            Ten sample colleagues with posts, reactions, files, meetings and encrypted chats, so you can see how everything looks. Sample colleagues reply automatically when you message them. Remove them before real employees start using the app.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAddSampleData}
              className="rounded-md bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
            >
              Add sample data
            </button>
            <button
              type="button"
              onClick={handleRemoveSampleData}
              className="rounded-md border border-black bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              Remove sample data
            </button>
          </div>
          {sampleDataFeedback && (
            <p className="mt-3 text-xs text-slate-600" role="status" aria-live="polite">
              {sampleDataFeedback}
            </p>
          )}
        </section>

        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-base font-semibold text-slate-900">About this prototype</h2>
          <p className="mt-2 text-xs leading-5 text-slate-600 sm:text-sm">
            Everything (accounts, messages, meetings and files) is saved only in this browser on this computer. Logins you create here work in this browser only. To try two people chatting, open a second tab and sign in as someone else. The full version connects to a real server so everyone can use it from their own devices.
          </p>
        </section>

        {isChannelModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
            onClick={() => setIsChannelModalOpen(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="new-channel-heading"
              className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl sm:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 id="new-channel-heading" className="text-base font-semibold text-slate-900">
                    Create a channel
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Choose an organization and add channel details.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsChannelModalOpen(false)}
                  aria-label="Close new channel form"
                  className="rounded-md px-2 py-1 text-lg leading-none text-slate-500 hover:bg-slate-100"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleChannelSubmit} className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  Organization
                  <select
                    value={newChannel.organization}
                    onChange={(event) =>
                      setNewChannel((current) => ({ ...current, organization: event.target.value }))
                    }
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  >
                    {organizationChannels.map((organization) => (
                      <option key={organization.organization} value={organization.organization}>
                        {organization.organization}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-medium text-slate-700">
                  Channel name
                  <div className="mt-1.5 flex items-center rounded-lg border border-slate-300 bg-slate-50 px-2.5 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-100">
                    <span className="text-slate-400">#</span>
                    <input
                      type="text"
                      value={newChannel.name}
                      onChange={(event) =>
                        setNewChannel((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="e.g. team-updates"
                      className="w-full border-0 bg-transparent px-2 py-2 text-xs outline-none"
                    />
                  </div>
                </label>
                <label className="block text-xs font-medium text-slate-700">
                  Description
                  <textarea
                    value={newChannel.description}
                    onChange={(event) =>
                      setNewChannel((current) => ({ ...current, description: event.target.value }))
                    }
                    placeholder="What is this channel for?"
                    rows="3"
                    className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-2 text-xs text-slate-900 outline-none focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  />
                </label>
                {newChannelError && <p className="text-xs text-red-600">{newChannelError}</p>}
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsChannelModalOpen(false)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    Create channel
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
          </>
        )}
      </div>

      {activeChatEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setActiveChatEmployee(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="people-chat-heading"
            className="flex max-h-[min(36rem,90vh)] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div>
                <h2 id="people-chat-heading" className="text-sm font-semibold text-slate-900">
                  Chat with {activeChatEmployee.fullName}
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">{activeChatEmployee.jobTitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveChatEmployee(null)}
                aria-label="Close chat"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div className="min-h-40 flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
              <p className="text-center text-xs text-slate-500">
                This is the beginning of your conversation with {activeChatEmployee.fullName}.
              </p>
              {(chatMessages[activeChatEmployee.employeeId] || []).map((message) => (
                <div key={message.id} className="ml-auto max-w-[85%] rounded-xl rounded-br-sm bg-violet-600 px-3 py-2 text-sm text-white">
                  <p className="whitespace-pre-wrap break-words">{message.message}</p>
                  <time className="mt-1 block text-right text-[10px] text-violet-100" dateTime={message.sentAt}>
                    {new Date(message.sentAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                  </time>
                </div>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex gap-2 border-t border-slate-200 p-3">
              <label className="sr-only" htmlFor="people-chat-message">Write a message</label>
              <input
                id="people-chat-message"
                value={chatDraft}
                onChange={(event) => setChatDraft(event.target.value)}
                placeholder="Write a message"
                maxLength={1000}
                required
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
              <button
                type="submit"
                aria-label="Send message"
                className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-3 text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
              >
                <Send size={16} aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>
      )}

      {meetingEmployee && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => setMeetingEmployee(null)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="people-meeting-heading"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 id="people-meeting-heading" className="text-base font-semibold text-slate-900">
                  Schedule a meeting
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Participant: <span className="font-medium text-slate-700">{meetingEmployee.fullName}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMeetingEmployee(null)}
                aria-label="Close meeting scheduler"
                className="rounded-md p-1 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            {meetingScheduled ? (
              <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm font-semibold text-emerald-800">Meeting scheduled</p>
                <p className="mt-1 text-xs text-emerald-700">{meetingScheduled.title}</p>
                <p className="mt-1 text-xs text-emerald-700">
                  With {meetingScheduled.employee} on {new Date(meetingScheduled.dateTime).toLocaleString()}.
                </p>
                <button
                  type="button"
                  onClick={() => setMeetingEmployee(null)}
                  className="mt-4 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleMeetingSubmit} className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  Meeting title
                  <input
                    value={meetingTitle}
                    onChange={(event) => setMeetingTitle(event.target.value)}
                    required
                    maxLength={100}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </label>
                <label className="block text-xs font-medium text-slate-700">
                  Date and time
                  <input
                    type="datetime-local"
                    value={meetingDateTime}
                    onChange={(event) => setMeetingDateTime(event.target.value)}
                    required
                    min={meetingMinimumDateTime}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                  />
                </label>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setMeetingEmployee(null)}
                    className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-md bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-300"
                  >
                    <Video size={14} aria-hidden="true" />
                    Schedule meeting
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
      </main>
    </div>
  );
}

export default App;