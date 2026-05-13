import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/credits',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CreditController::index
* @see app/Http/Controllers/CreditController.php:14
* @route '/credits'
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
* @see \App\Http\Controllers\CreditController::store
* @see app/Http/Controllers/CreditController.php:28
* @route '/credits'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/credits',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CreditController::store
* @see app/Http/Controllers/CreditController.php:28
* @route '/credits'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditController::store
* @see app/Http/Controllers/CreditController.php:28
* @route '/credits'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditController::store
* @see app/Http/Controllers/CreditController.php:28
* @route '/credits'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditController::store
* @see app/Http/Controllers/CreditController.php:28
* @route '/credits'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CreditController::repay
* @see app/Http/Controllers/CreditController.php:90
* @route '/credits/{credit}/repay'
*/
export const repay = (args: { credit: string | number | { id: string | number } } | [credit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: repay.url(args, options),
    method: 'post',
})

repay.definition = {
    methods: ["post"],
    url: '/credits/{credit}/repay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CreditController::repay
* @see app/Http/Controllers/CreditController.php:90
* @route '/credits/{credit}/repay'
*/
repay.url = (args: { credit: string | number | { id: string | number } } | [credit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { credit: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { credit: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            credit: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        credit: typeof args.credit === 'object'
        ? args.credit.id
        : args.credit,
    }

    return repay.definition.url
            .replace('{credit}', parsedArgs.credit.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditController::repay
* @see app/Http/Controllers/CreditController.php:90
* @route '/credits/{credit}/repay'
*/
repay.post = (args: { credit: string | number | { id: string | number } } | [credit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: repay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditController::repay
* @see app/Http/Controllers/CreditController.php:90
* @route '/credits/{credit}/repay'
*/
const repayForm = (args: { credit: string | number | { id: string | number } } | [credit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: repay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CreditController::repay
* @see app/Http/Controllers/CreditController.php:90
* @route '/credits/{credit}/repay'
*/
repayForm.post = (args: { credit: string | number | { id: string | number } } | [credit: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: repay.url(args, options),
    method: 'post',
})

repay.form = repayForm

const CreditController = { index, store, repay }

export default CreditController