import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ai',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::index
* @see app/Http/Controllers/AnwarTwinController.php:11
* @route '/ai'
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
* @see \App\Http\Controllers\AnwarTwinController::simulate
* @see app/Http/Controllers/AnwarTwinController.php:20
* @route '/ai/simulate'
*/
export const simulate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulate.url(options),
    method: 'post',
})

simulate.definition = {
    methods: ["post"],
    url: '/ai/simulate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\AnwarTwinController::simulate
* @see app/Http/Controllers/AnwarTwinController.php:20
* @route '/ai/simulate'
*/
simulate.url = (options?: RouteQueryOptions) => {
    return simulate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AnwarTwinController::simulate
* @see app/Http/Controllers/AnwarTwinController.php:20
* @route '/ai/simulate'
*/
simulate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: simulate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::simulate
* @see app/Http/Controllers/AnwarTwinController.php:20
* @route '/ai/simulate'
*/
const simulateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\AnwarTwinController::simulate
* @see app/Http/Controllers/AnwarTwinController.php:20
* @route '/ai/simulate'
*/
simulateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: simulate.url(options),
    method: 'post',
})

simulate.form = simulateForm

const ai = {
    index: Object.assign(index, index),
    simulate: Object.assign(simulate, simulate),
}

export default ai