import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
export const view = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/qr/view/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
view.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return view.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
view.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
view.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
const viewForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: view.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
viewForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: view.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::view
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
viewForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: view.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

view.form = viewForm

const update = {
    view: Object.assign(view, view),
}

export default update