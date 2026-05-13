import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/transfer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\TransferController::index
* @see app/Http/Controllers/TransferController.php:13
* @route '/transfer'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\TransferController::process
* @see app/Http/Controllers/TransferController.php:20
* @route '/transfer/{method}'
*/
export const process = (args: { method: string | number } | [method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

process.definition = {
    methods: ["post"],
    url: '/transfer/{method}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TransferController::process
* @see app/Http/Controllers/TransferController.php:20
* @route '/transfer/{method}'
*/
process.url = (args: { method: string | number } | [method: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { method: args }
    }

    if (Array.isArray(args)) {
        args = {
            method: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        method: args.method,
    }

    return process.definition.url
            .replace('{method}', parsedArgs.method.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TransferController::process
* @see app/Http/Controllers/TransferController.php:20
* @route '/transfer/{method}'
*/
process.post = (args: { method: string | number } | [method: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: process.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransferController::process
* @see app/Http/Controllers/TransferController.php:20
* @route '/transfer/{method}'
*/
const processForm = (args: { method: string | number } | [method: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: process.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\TransferController::process
* @see app/Http/Controllers/TransferController.php:20
* @route '/transfer/{method}'
*/
processForm.post = (args: { method: string | number } | [method: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: process.url(args, options),
    method: 'post',
})

process.form = processForm

const TransferController = { index, process }

export default TransferController