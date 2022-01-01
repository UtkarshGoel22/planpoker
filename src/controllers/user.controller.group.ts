import { Request, Response } from 'express';
import {
  ErrorMessage,
  SuccessMessage,
} from '../constants/message';
import { SEARCH_LIMIT } from "../constants/customTypes";
import { ErrorTypes } from '../constants/errorType';
import { Group } from '../entity/Group';
import { generateCustomResponse } from '../middlewares/user.validation';
import ResponseMessage from '../models/ResponseMessage';
import { createGroupDB, findGroup } from '../repositories/group.repository';

export const createGroup = async (req: Request, res: Response) => {
  const responseMessage: ResponseMessage = {
    success: false,
    message: '',
    data: undefined,
  };

  let body = req.body;

  await createGroupDB(
    {
      name: body.name,
      admin: body.admin,
      members: body.members,
    },
    responseMessage
  )
    .then((result) => {
      return res.status(201).json(result.responseMessage);
    })
    .catch((errObject) => {
      if (errObject.errData[ErrorTypes.MEMBERS]) {
        return res
          .status(400)
          .json(generateCustomResponse(false, errObject.message, errObject.errData));
      } else {
        return res
          .status(500)
          .json(generateCustomResponse(false, errObject.message, errObject.errData));
      }
    });
};

/**
 * Search groups by group name and return the result in array format with
 * details like group name, admin, members count
 * @param req : Request Parameter
 * @param res : Response
 */
export const searchGroup = async (req: Request, res: Response) => {
  let { searchKey, limit: limitFromRequest } = req.query;

  const limit = limitFromRequest ? Number(limitFromRequest) : SEARCH_LIMIT;

  if (!searchKey) {
    searchKey = '';
  }

  try {
    const groups = await findGroup(searchKey.toString(), limit);
    const responseMessage: ResponseMessage = {
      data: groups
        .map((group: Group) => {
          return {
            admin: group.admin,
            name: group.name,
            countOfMembers: group.countOfMembers,
            id: group.id,
          };
        })
        .filter((_, i) => i < limit),
      success: true,
      message: SuccessMessage.GROUP_SEARCH_SUCCESSFUL,
    };

    return res.status(200).json(responseMessage);
  } catch (_) {
    let errorData: any = {};
    errorData[ErrorTypes.SOME_THING_WENT_WRONG] =
      ErrorMessage.SOMETHING_WENT_WRONG;
    let responseMessage: ResponseMessage = {
      success: false,
      data: errorData,
      message: ErrorMessage.SOMETHING_WENT_WRONG,
    };

    return res.status(500).json(responseMessage);
  }
};
