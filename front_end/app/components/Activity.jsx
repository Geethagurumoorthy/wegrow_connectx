"use client";

import React, { useState } from "react";
import Files from "./Files";
import Posts from "./Posts";
import { CiCalendar, CiVideoOn } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
} from "react-router-dom";

const Activity = () => {
  /* LINK ACTIVE STYLE FUNCTION */
  const navLinkClasses = ({ isActive }) =>
    `font-semibold px-2 py-4 ${
      isActive
        ? " border-blue-600 border-b-3 "
        : "text-gray-600 hover:text-black"
    }`;
  /* handle calander  modal */
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [check, setCheck] = useState(false)

  const styles = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    borderRadius: "5px",
    bgcolor: "background.paper",
    border: "none",
    outline: "none",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div id="activity" className="flex">
      {/* NOTIFICATION CONTAINER */}
      <section className="notifications min-h-screen flex-3 border-1 border-stone-200 py-3 ps-3">
        <p className="mb-5 font-bold text-xl">Activity</p>
        <div className="text-[12px] font-semibold">
          <button className="mr-1 rounded-full px-3 py-1 bg-indigo-100 text-indigo-800">
            All
          </button>
          <button className="mr-1 rounded-full px-3 py-1 border-1 border-slate-400">
            Unread
          </button>
          <button className="mr-1 rounded-full px-3 py-1 border-1 border-slate-400">
            @Mentions
          </button>
        </div>
      </section>

      {/* CONTENT CONTAINER */}
      <section className="content flex-9">
        <BrowserRouter>
          <nav className="flex py-2 px-4 justify-between border-1 border-stone-200">
            <div className="flex gap-x-3 items-center">
              <p
                className="text-[12px] flex items-center justify-center bg-green-700 font-bold 
            text-white h-8 w-8 rounded-lg"
              >
                WG
              </p>
              <div>
                <p className="font-bold">hr-help</p>
                <p className="text-[12px] text-gray-700">
                  WeGrow · Questions about leave, payroll and policies.
                </p>
              </div>
              <div>
                <NavLink
                  to={"posts"}
                  className={({ isActive }) =>
                    `${navLinkClasses({ isActive })} mx-5`
                  }
                >
                  Posts
                </NavLink>
                <NavLink to={"files"} className={navLinkClasses}>
                  Files
                </NavLink>
              </div>
            </div>

            <div className="flex gap-x-4 items-center">
              <Button onClick={handleOpen}>
                <CiCalendar size={24} />
              </Button>

              {/* MODAL */}
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={styles}>
                  <div className="flex justify-between">
                    <p className="font-bold text-lg">New meeting</p>
                    <button className="cursor-pointer" onClick={handleClose}>
                      <IoClose size={24} />
                    </button>
                  </div>

                  {/* MODAL FORM */}
                  <div className="flex flex-col gap-y-1 mb-2">
                    <label htmlFor="title">Title</label>
                    <input
                      className="p-2 border border-slate-400 rounded-md"
                      type="text"
                      name="title"
                      placeholder="Add a title"
                    />
                  </div>

                  <div className="flex flex-col gap-y-1 mb-2">
                    <label htmlFor="attendees">Attendees</label>
                    <input
                      className="p-2 border border-slate-400 rounded-md"
                      type="text"
                      name="attendees"
                      placeholder="Add required attendees"
                    />
                  </div>

                  <div className="flex justify-around">
                    <div className="flex flex-col flex-6 mb-2">
                      <label htmlFor="date">Date</label>
                      <input
                        className="p-2 border border-slate-400 rounded-md"
                        type="date"
                        name="date"
                        placeholder="Add required attendees"
                      />
                    </div>

                    <div className="flex flex-col flex-3 ml-3 mb-2">
                      <label htmlFor="start">Start</label>
                      <input
                        className="p-2 border border-slate-400 rounded-md"
                        type="time"
                        name="start"
                        placeholder="Add required attendees"
                      />
                    </div>

                    <div className="flex flex-col flex-3 ml-3 mb-2">
                      <label htmlFor="end">End</label>
                      <input
                        className="p-2 border border-slate-400 rounded-md"
                        type="time"
                        name="end"
                        placeholder="Add required attendees"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-1 mb-2">
                    <label htmlFor="postopt">
                      Post in a channel (optional)
                    </label>
                    <select
                      className="p-2 border border-slate-400 rounded-md"
                      name="postopt"
                      id=""
                    >
                      <option value="">Priya rahavan</option>
                    </select>
                  </div>

                  <div className="mb-2">
                    <input
                    checked
                      className="p-2 mr-3 border border-slate-400 rounded-md"
                      type="checkbox"
                      name="createlink"
                      placeholder="Add required attendees"
                    />
                    <label htmlFor="createlink">
                      Create an online meeting link
                    </label>
                  </div>

                  <div className="flex flex-col gap-y-1 mb-2">
                    <label htmlFor="pastelink">
                      Or paste your own meeting link
                    </label>
                    <input
                      className="p-2 mr-3 border border-slate-400 rounded-md"
                      type="url"
                      name="pastelink"
                      placeholder="https://"
                    />
                  </div>

                  <div className="flex flex-col gap-y-1 mb-2">
                    <label htmlFor="details">Details</label>
                    <textarea
                      className="p-2 mr-3 border border-slate-400 rounded-md"
                      name="details"
                      placeholder="Agenda, notes or location"
                    />
                  </div>

                  <div className="p-4 flex gap-x-4 justify-end">
                    <Button variant="outlined" onClick={handleClose}>Cancel</Button>
                    <Button variant="contained">Send invite</Button>
                  </div>
                </Box>
              </Modal>

              <a
                href="#"
                className="flex items-center gap-3 text-white bg-blue-800 
              rounded-lg px-2 py-1 font-semibold"
              >
                <CiVideoOn size={15} /> Meet
              </a>
            </div>
          </nav>

          {/* MAIN VIEW AREA (BELOW THE NAVBAR) */}
          <main>
            <Routes>
              <Route index element={<Navigate to="Posts" replace />} />
              <Route path="posts" element={<Posts />} />
              <Route path="files" element={<Files />} />
            </Routes>
          </main>
        </BrowserRouter>
      </section>
    </div>
  );
};

export default Activity;
