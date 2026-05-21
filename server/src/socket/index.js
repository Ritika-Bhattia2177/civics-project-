let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;
};

export const emitIssueUpdate = (payload) => {
  ioInstance?.emit('issue:updated', payload);
};
