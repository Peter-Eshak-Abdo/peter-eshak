// === Submit Answer ===
socket.on("submit-answer", ({ roomId, questionId, answer }) => {
  const room = rooms.get(roomId);
  if (!room) return;

  const question = room.questions.find((q) => q.id === questionId);
  const team = room.teams.find((t) => t.socketId === socket.id);

  if (!question || !team) return;

  const isCorrect = answer === question.correctAnswer;
  if (isCorrect) {
    team.score += 1;
  }

  socket.emit("answer-result", { correct: isCorrect });
  io.to(room.admin).emit("answer-submitted", {
    teamId: team.id,
    isCorrect,
  });
});

// === Next Question (admin only) ===
socket.on("next-question", ({ roomId }) => {
  const room = rooms.get(roomId);
  if (!room || room.admin !== socket.id) return;

  room.currentQuestionIndex++;
  const hasMore = room.currentQuestionIndex < room.questions.length;

  if (hasMore) {
    io.to(roomId).emit("question", {
      question: room.questions[room.currentQuestionIndex],
      index: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      timePerQuestion: room.timePerQuestion,
    });
  } else {
    room.status = "finished";
    io.to(roomId).emit("exam-finished", { teams: room.teams });
  }
});
