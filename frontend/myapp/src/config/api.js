// src/config/api.js
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile',
    CREATE: '/profile',
    GET_STUDENT: '/profile/student/:userId',
    GET_ALUMNI: '/profile/alumni/:userId',
  },
  CHAT: {
    GET_ALL: '/chat',
    GET_MESSAGES: '/message',
    SEND_MESSAGE: '/message',
    START_CHAT: '/chat/start',
    DELETE: '/chat/:id',
  },
  MATCH: {
    GET_STUDENT: '/match',
    GET_ALUMNI: '/match',
    GET_DETAILS: '/match/:matchId',
  },
  CONNECTION: {
    GET_LIST: '/connect',
    SEND: '/connect',
    ACCEPT: '/connect/:id/accept',
    REJECT: '/connect/:id/reject',
    GET_PENDING: '/connect/pending',
  },
  JOB: {
    GET_ALL: '/job',
    GET_ONE: '/job/:id',
    APPLY: '/job/:id/apply',
    GET_APPLICANTS: '/job/:id/applicants',
    UPDATE_APPLICANT: '/job/:jobId/applicants/:studentId',
  },
  MESSAGE: {
    GET_BY_CHAT: '/message/:chatId',
    SEND: '/message',
    DELETE: '/message/:id',
    MARK_READ: '/message/:id/read',
  },
};