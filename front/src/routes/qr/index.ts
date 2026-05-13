import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import update from './update'
/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
export const scan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(args, options),
    method: 'get',
})

scan.definition = {
    methods: ["get","head"],
    url: '/qr/redirect/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
scan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return scan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
scan.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: scan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
scan.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: scan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
const scanForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
scanForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::scan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
scanForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: scan.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

scan.form = scanForm

/**
* @see \App\Http\Controllers\Qr\TokenController::confirm
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
export const confirm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

confirm.definition = {
    methods: ["post"],
    url: '/qr/confirm/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::confirm
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirm.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return confirm.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::confirm
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirm.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::confirm
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
const confirmForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::confirm
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirmForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirm.url(args, options),
    method: 'post',
})

confirm.form = confirmForm

/**
* @see \App\Http\Controllers\Qr\TokenController::approve
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
export const approve = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/qr/approve/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::approve
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
approve.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return approve.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::approve
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
approve.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::approve
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
const approveForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::approve
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
approveForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Qr\TokenController::cancel
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
export const cancel = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/qr/cancel/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::cancel
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancel.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return cancel.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::cancel
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancel.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::cancel
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
const cancelForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::cancel
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancelForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancel.url(args, options),
    method: 'post',
})

cancel.form = cancelForm

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
export const status = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/qr/status/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
status.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    if (Array.isArray(args)) {
        args = {
            token: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        token: args.token,
    }

    return status.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
status.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
status.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
const statusForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
statusForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::status
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
statusForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

const qr = {
    scan: Object.assign(scan, scan),
    update: Object.assign(update, update),
    confirm: Object.assign(confirm, confirm),
    approve: Object.assign(approve, approve),
    cancel: Object.assign(cancel, cancel),
    status: Object.assign(status, status),
}

export default qr