import type { AppInstance } from ".."
import { AppError } from "../libs/Errors";
import { isJSONString } from "./services/commonService";


export type APIResponse<T> = {
    data: T | T[],
    message: string,
    success:boolean 
}

/**
 * @function GlobalResponseHandler
 * @param {Elysia} app - The Elysia application instance.
 * @description Sets up a global response handler for Elysia, standardizing API output.
 */
export const GlobalResponseHandler = (app: AppInstance) => {

    /**
     * @event onAfterResponse
     * @description Formats successful responses into a standard `{ data, message, success: true }` structure.
     * @param {object} context - The Elysia context.
     * @param {any} context.response - The raw response.
     * @returns {object} A standardized response object.
     */
    app.onAfterResponse(({ response }) => {
        return response
    })

    /**
    * @event onError
    * @description This hook is executed when an error occurs during request processing.
    * It handles different types of errors and returns a standardized error response.
    * @param {object} context - The Elysia context object containing error details.
    * @param {Error} context.error - The error object that was thrown.
    * @param {string} context.code - The error code provided by Elysia (e.g., 'VALIDATION').
    * @returns {object} A standardized error response object.
    */
    app.onError(({ error, code, }) => {


        if(code === 'NOT_FOUND'){
            return new Response(
                JSON.stringify({ success: false, message: 'URL Resource Not Found' }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 404
                }
            )
        }

        // Handle Elysia's built-in 'VALIDATION' errors
        if (code === 'VALIDATION') {

            if (error.message && typeof error.message === 'string' && isJSONString(error.message)) {
                return new Response(
                    JSON.stringify({ success: false, message: JSON.parse(error.message)?.summary }),
                    {
                        headers: { "Content-Type": "application/json" },
                        status: 400
                    }
                )
            }

            return new Response(
                JSON.stringify({ success: false, message: error.message }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 400
                }
            )
        }

        // Handle custom application errors that extend `AppError`
        if (error instanceof AppError) {
            return new Response(
                JSON.stringify({ success: false, message: error.status === 500 ? error.stack : error.message }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: error.status
                }
            )
        }

        // Handle all other unhandled errors as generic Internal Server Errors
        return new Response(
            JSON.stringify({ success: false, message: 'Internal Server Error', details: error }),
            {
                headers: { "Content-Type": "application/json" },
                status: 500
            }
        )
    });
}