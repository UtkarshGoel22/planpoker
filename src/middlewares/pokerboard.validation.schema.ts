import Joi from '@hapi/joi';
import {
  ValidationMessages,
} from '../constants/message';
import {
  TicketTypes,
  DeckType,
  RoleTypes
} from "../constants/customTypes";

export const PokerboardIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': `Id ${ValidationMessages.REQUIRED}`,
      'string.empty': `Id ${ValidationMessages.REQUIRED}`,
    }),
});

export const UserSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': `UserId ${ValidationMessages.REQUIRED}`,
      'string.empty': `UserId ${ValidationMessages.REQUIRED}`,
    }),
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': `UserEmail ${ValidationMessages.REQUIRED}`,
      'string.email': `${ValidationMessages.INVALID_EMAIL}`,
      'string.empty': `UserEmail ${ValidationMessages.REQUIRED}`,
    }),
});

export const TicketSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': `Ticket id ${ValidationMessages.REQUIRED}`,
      'string.empty': `Ticket id ${ValidationMessages.REQUIRED}`,
    }),
  summary: Joi.string().messages({
    'any.required': `Ticket Summary ${ValidationMessages.REQUIRED}`,
    'string.empty': `Ticket Summary ${ValidationMessages.REQUIRED}`,
  }),
  description: Joi.string().messages({
    'any.required': `Ticket Description ${ValidationMessages.REQUIRED}`,
    'string.empty': `Ticket Description ${ValidationMessages.REQUIRED}`,
  }),
  estimate: Joi.number()
    .optional()
    .messages({
      'any.base': `Ticket Estimate ${ValidationMessages.INVALID_BASE_NUMBER}`,
    }),
  type: Joi.string()
    .valid(TicketTypes.BUG, TicketTypes.STORY, TicketTypes.Task)
    .required()
    .messages({
      'any.required': `Ticket Type ${ValidationMessages.REQUIRED}`,
      'any.only': `${ValidationMessages.INVALID_TICKET_TYPE}`,
    }),
});

export const createPokerBoardSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(4)
    .max(30)
    .alphanum()
    .messages({
      'any.required': `Pokerboard name ${ValidationMessages.REQUIRED}`,
      'string.alphanum': `Pokerboard name ${ValidationMessages.ALPHANUMERIC}`,
      'string.max': `Pokerboard name ${ValidationMessages.POKER_BOARD_MAX}`,
      'string.min': `Pokerbaord name ${ValidationMessages.MIN_CHAR}`,
    }),

  manager: Joi.string()
    .required()
    .messages({
      'any.required': `Manager ${ValidationMessages.REQUIRED}`,
      'string.empty': `Manager ${ValidationMessages.REQUIRED}`,
    }),
  deckType: Joi.string()
    .valid(DeckType.EVEN, DeckType.SERIAL, DeckType.ODD, DeckType.FIBONACCI)
    .required()
    .messages({
      'any.required': `DeckType ${ValidationMessages.REQUIRED}`,
      'any.only': `${ValidationMessages.INVALID_DECK_TYPE}`,
    }),
  users: Joi.array()
    .required()
    .items(UserSchema)
    .messages({
      'any.required': `Users ${ValidationMessages.REQUIRED}`,
    }),
  groups: Joi.array()
    .required()
    .items(Joi.string())
    .messages({
      'any.required': `Groups ${ValidationMessages.REQUIRED}`,
    }),
});

export const InviteSchema = Joi.object({
  pokerBoardId: Joi.string()
    .required()
    .messages({
      'any.required': `PokerBoardId ${ValidationMessages.REQUIRED}`,
    }),
});

export const TicketsSchema = Joi.object({
  tickets: Joi.array()
    .required()
    .items(TicketSchema)
    .messages({
      'any.required': `Tickets ${ValidationMessages.REQUIRED}`,
    }),
});

export const UpdateTicketSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': `Ticket id ${ValidationMessages.REQUIRED}`,
      'string.empty': `Ticket id ${ValidationMessages.REQUIRED}`,
    }),
  summary: Joi.string()
    .optional()
    .messages({
      'string.empty': `Ticket Summary ${ValidationMessages.REQUIRED}`,
    }),
  description: Joi.string()
    .optional()
    .messages({
      'string.empty': `Ticket Description ${ValidationMessages.REQUIRED}`,
    }),
  estimate: Joi.number()
    .optional()
    .messages({
      'any.base': `Ticket Estimate ${ValidationMessages.INVALID_BASE_NUMBER}`,
    }),
  type: Joi.string()
    .valid(TicketTypes.BUG, TicketTypes.STORY, TicketTypes.Task)
    .optional()
    .messages({
      'any.only': `${ValidationMessages.INVALID_TICKET_TYPE}`,
    }),
  order: Joi.number()
    .optional()
    .messages({
      'any.base': `Ticket Estimate ${ValidationMessages.INVALID_BASE_NUMBER}`,
    }),
});

export const UpdateTicketsSchema = Joi.object({
  tickets: Joi.array()
    .required()
    .items(UpdateTicketSchema)
    .messages({
      'any.required': `Tickets ${ValidationMessages.REQUIRED}`,
    }),
});

export const PokerboardUserSchema = Joi.object({
  userId: Joi.string()
    .required()
    .messages({
      'any.required': `UserId ${ValidationMessages.REQUIRED}`,
      'string.empty': `UserId${ValidationMessages.REQUIRED}`,
    }),
  role: Joi.string()
    .required()
    .valid(RoleTypes.MANAGER, RoleTypes.PLAYER, RoleTypes.SPECTATOR)
    .messages({
      'any.required': `Role ${ValidationMessages.REQUIRED}`,
      'any.only': `${ValidationMessages.INVALID_ROLE_TYPE}`,
    }),
});

export const UpdatePokerboardUserSchema = Joi.object({
  users: Joi.array()
    .required()
    .items(PokerboardUserSchema)
    .messages({
      'any.required': `Users ${ValidationMessages.REQUIRED}`,
    }),
});

export const TicketIdAndPokerboardIdSchema = Joi.object({
  id: Joi.string()
    .required()
    .messages({
      'any.required': `Id ${ValidationMessages.REQUIRED}`,
      'string.empty': `Id ${ValidationMessages.REQUIRED}`,
    }),
  ticketId: Joi.string()
    .required()
    .messages({
      'any.required': `Id ${ValidationMessages.REQUIRED}`,
      'string.empty': `Id ${ValidationMessages.REQUIRED}`,
    }),
});
