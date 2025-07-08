import React, { useState, useEffect } from "react";
import "../../css/course_open.css";
import api from "../../api/api";

const LectureNotes = ({ lessons, courseTitle }) => {
  const [expandedNotes, setExpandedNotes] = useState({});
  const [notePages, setNotePages] = useState({});
  const [loadingNote, setLoadingNote] = useState(null);
  const [currentPage, setCurrentPage] = useState({});

  const toggleNote = (lessonId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [lessonId]: !prev[lessonId],
    }));

    if (!notePages[lessonId]) {
      fetchNoteContent(lessonId);
    }
  };

  const fetchNoteContent = async (lessonId) => {
    setLoadingNote(lessonId);
    try {
      const response = await api.get(`/api/lessons/${lessonId}/notes-content`);
      setNotePages((prev) => ({
        ...prev,
        [lessonId]: response.data.pages,
      }));
      setCurrentPage((prev) => ({
        ...prev,
        [lessonId]: 0,
      }));
    } catch (error) {
      setNotePages((prev) => ({
        ...prev,
        [lessonId]: [{ marker: "", content: "Error loading note content." }],
      }));
      setCurrentPage((prev) => ({
        ...prev,
        [lessonId]: 0,
      }));
    } finally {
      setLoadingNote(null);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      const openLessonId = Object.keys(expandedNotes).find(
        (id) => expandedNotes[id]
      );
      if (!openLessonId || !notePages[openLessonId]) return;

      const page = currentPage[openLessonId] || 0;
      const totalPages = notePages[openLessonId].length;

      if (e.key === "ArrowRight" && page < totalPages - 1) {
        setCurrentPage((prev) => ({
          ...prev,
          [openLessonId]: page + 1,
        }));
      } else if (e.key === "ArrowLeft" && page > 0) {
        setCurrentPage((prev) => ({
          ...prev,
          [openLessonId]: page - 1,
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expandedNotes, notePages, currentPage]);

  return (
    <div className="lecture-notes">
      <h2>Lecture Notes for {courseTitle || "this Course"}</h2>
      <p className="lecture-description">
        Click on a note to view its content. Use arrow keys or buttons to
        navigate pages.
      </p>

      <div className="notes-container">
        {lessons.length > 0 ? (
          lessons.map((lesson, index) =>
            lesson.notes_file ? (
              <div
                key={index}
                className={`note-card ${
                  expandedNotes[lesson.id] ? "expanded" : ""
                }`}
              >
                <div
                  className="note-header"
                  onClick={() => toggleNote(lesson.id)}
                >
                  <h3>{lesson.title}</h3>
                  <span className="toggle-icon">
                    {expandedNotes[lesson.id] ? "−" : "+"}
                  </span>
                </div>

                {expandedNotes[lesson.id] && (
                  <div className="note-content">
                    {loadingNote === lesson.id ? (
                      <div className="note-loading">
                        <div className="loading-spinner"></div>
                        <span className="loading-text">Loading notes...</span>
                      </div>
                    ) : (
                      <>
                        {notePages[lesson.id] &&
                          notePages[lesson.id].length > 0 && (
                            <div className="notes-text-content">
                              <div className="text-content">
                                {notePages[lesson.id][
                                  currentPage[lesson.id] || 0
                                ].marker && (
                                  <strong>
                                    {
                                      notePages[lesson.id][
                                        currentPage[lesson.id] || 0
                                      ].marker
                                    }
                                  </strong>
                                )}
                                <div style={{ marginTop: 8 }}>
                                  {
                                    notePages[lesson.id][
                                      currentPage[lesson.id] || 0
                                    ].content
                                  }
                                </div>
                              </div>
                              <div className="pagination">
                                <button
                                  className="pagination-button prev"
                                  onClick={() =>
                                    setCurrentPage((prev) => ({
                                      ...prev,
                                      [lesson.id]: Math.max(
                                        (prev[lesson.id] || 0) - 1,
                                        0
                                      ),
                                    }))
                                  }
                                  disabled={(currentPage[lesson.id] || 0) === 0}
                                  aria-label="Previous page"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="15 18 9 12 15 6"></polyline>
                                  </svg>
                                </button>
                                <span className="page-indicator">
                                  Page {(currentPage[lesson.id] || 0) + 1} of{" "}
                                  {notePages[lesson.id].length}
                                </span>
                                <button
                                  className="pagination-button next"
                                  onClick={() =>
                                    setCurrentPage((prev) => ({
                                      ...prev,
                                      [lesson.id]: Math.min(
                                        (prev[lesson.id] || 0) + 1,
                                        notePages[lesson.id].length - 1
                                      ),
                                    }))
                                  }
                                  disabled={
                                    (currentPage[lesson.id] || 0) ===
                                    notePages[lesson.id].length - 1
                                  }
                                  aria-label="Next page"
                                >
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="9 18 15 12 9 6"></polyline>
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        <a
                          href={lesson.notes_file_url_full}
                          className="download-link"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Download Full File
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : null
          )
        ) : (
          <p className="alt">No notes available for this course.</p>
        )}
      </div>
    </div>
  );
};

export default LectureNotes;
