import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/daret',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DaretController::index
* @see app/Http/Controllers/DaretController.php:14
* @route '/daret'
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
* @see \App\Http\Controllers\DaretController::store
* @see app/Http/Controllers/DaretController.php:33
* @route '/daret'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/daret',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DaretController::store
* @see app/Http/Controllers/DaretController.php:33
* @route '/daret'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::store
* @see app/Http/Controllers/DaretController.php:33
* @route '/daret'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::store
* @see app/Http/Controllers/DaretController.php:33
* @route '/daret'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::store
* @see app/Http/Controllers/DaretController.php:33
* @route '/daret'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\DaretController::pay
* @see app/Http/Controllers/DaretController.php:150
* @route '/daret/{group}/pay'
*/
export const pay = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/daret/{group}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DaretController::pay
* @see app/Http/Controllers/DaretController.php:150
* @route '/daret/{group}/pay'
*/
pay.url = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return pay.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::pay
* @see app/Http/Controllers/DaretController.php:150
* @route '/daret/{group}/pay'
*/
pay.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::pay
* @see app/Http/Controllers/DaretController.php:150
* @route '/daret/{group}/pay'
*/
const payForm = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::pay
* @see app/Http/Controllers/DaretController.php:150
* @route '/daret/{group}/pay'
*/
payForm.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pay.url(args, options),
    method: 'post',
})

pay.form = payForm

/**
* @see \App\Http\Controllers\DaretController::accept
* @see app/Http/Controllers/DaretController.php:75
* @route '/daret/{group}/accept'
*/
export const accept = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/daret/{group}/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DaretController::accept
* @see app/Http/Controllers/DaretController.php:75
* @route '/daret/{group}/accept'
*/
accept.url = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return accept.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::accept
* @see app/Http/Controllers/DaretController.php:75
* @route '/daret/{group}/accept'
*/
accept.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::accept
* @see app/Http/Controllers/DaretController.php:75
* @route '/daret/{group}/accept'
*/
const acceptForm = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::accept
* @see app/Http/Controllers/DaretController.php:75
* @route '/daret/{group}/accept'
*/
acceptForm.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: accept.url(args, options),
    method: 'post',
})

accept.form = acceptForm

/**
* @see \App\Http\Controllers\DaretController::decline
* @see app/Http/Controllers/DaretController.php:112
* @route '/daret/{group}/decline'
*/
export const decline = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

decline.definition = {
    methods: ["post"],
    url: '/daret/{group}/decline',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DaretController::decline
* @see app/Http/Controllers/DaretController.php:112
* @route '/daret/{group}/decline'
*/
decline.url = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return decline.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::decline
* @see app/Http/Controllers/DaretController.php:112
* @route '/daret/{group}/decline'
*/
decline.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::decline
* @see app/Http/Controllers/DaretController.php:112
* @route '/daret/{group}/decline'
*/
const declineForm = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::decline
* @see app/Http/Controllers/DaretController.php:112
* @route '/daret/{group}/decline'
*/
declineForm.post = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: decline.url(args, options),
    method: 'post',
})

decline.form = declineForm

/**
* @see \App\Http\Controllers\DaretController::destroy
* @see app/Http/Controllers/DaretController.php:120
* @route '/daret/{group}'
*/
export const destroy = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/daret/{group}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DaretController::destroy
* @see app/Http/Controllers/DaretController.php:120
* @route '/daret/{group}'
*/
destroy.url = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { group: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { group: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            group: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        group: typeof args.group === 'object'
        ? args.group.id
        : args.group,
    }

    return destroy.definition.url
            .replace('{group}', parsedArgs.group.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DaretController::destroy
* @see app/Http/Controllers/DaretController.php:120
* @route '/daret/{group}'
*/
destroy.delete = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DaretController::destroy
* @see app/Http/Controllers/DaretController.php:120
* @route '/daret/{group}'
*/
const destroyForm = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DaretController::destroy
* @see app/Http/Controllers/DaretController.php:120
* @route '/daret/{group}'
*/
destroyForm.delete = (args: { group: string | number | { id: string | number } } | [group: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const daret = {
    index: Object.assign(index, index),
    store: Object.assign(store, store),
    pay: Object.assign(pay, pay),
    accept: Object.assign(accept, accept),
    decline: Object.assign(decline, decline),
    destroy: Object.assign(destroy, destroy),
}

export default daret