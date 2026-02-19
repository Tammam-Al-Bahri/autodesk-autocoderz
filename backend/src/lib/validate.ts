import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

export const validate = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: {
                title: `Validation failed - ${result.error.issues[0].path}`,
                description: `${result.error.issues[0].message}`,
            },
        });
        return;
    }

    req.body = result.data;
    next();
};
