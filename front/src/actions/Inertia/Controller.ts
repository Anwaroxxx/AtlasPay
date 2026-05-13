import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return Controller980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
const Controller980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/'
*/
Controller980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller980bb49ee7ae63891f1d891d2fbcf1c9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller980bb49ee7ae63891f1d891d2fbcf1c9.form = Controller980bb49ee7ae63891f1d891d2fbcf1c9Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
const Controller00777c1cd09820c6807c8fdc0ec88209 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller00777c1cd09820c6807c8fdc0ec88209.url(options),
    method: 'get',
})

Controller00777c1cd09820c6807c8fdc0ec88209.definition = {
    methods: ["get","head"],
    url: '/test',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
Controller00777c1cd09820c6807c8fdc0ec88209.url = (options?: RouteQueryOptions) => {
    return Controller00777c1cd09820c6807c8fdc0ec88209.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
Controller00777c1cd09820c6807c8fdc0ec88209.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller00777c1cd09820c6807c8fdc0ec88209.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
Controller00777c1cd09820c6807c8fdc0ec88209.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller00777c1cd09820c6807c8fdc0ec88209.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
const Controller00777c1cd09820c6807c8fdc0ec88209Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller00777c1cd09820c6807c8fdc0ec88209.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
Controller00777c1cd09820c6807c8fdc0ec88209Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller00777c1cd09820c6807c8fdc0ec88209.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/test'
*/
Controller00777c1cd09820c6807c8fdc0ec88209Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller00777c1cd09820c6807c8fdc0ec88209.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller00777c1cd09820c6807c8fdc0ec88209.form = Controller00777c1cd09820c6807c8fdc0ec88209Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
const Controller95705e14f1a8b3ce17e88f247699f891 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller95705e14f1a8b3ce17e88f247699f891.url(options),
    method: 'get',
})

Controller95705e14f1a8b3ce17e88f247699f891.definition = {
    methods: ["get","head"],
    url: '/qr/create/sender',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
Controller95705e14f1a8b3ce17e88f247699f891.url = (options?: RouteQueryOptions) => {
    return Controller95705e14f1a8b3ce17e88f247699f891.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
Controller95705e14f1a8b3ce17e88f247699f891.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller95705e14f1a8b3ce17e88f247699f891.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
Controller95705e14f1a8b3ce17e88f247699f891.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller95705e14f1a8b3ce17e88f247699f891.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
const Controller95705e14f1a8b3ce17e88f247699f891Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller95705e14f1a8b3ce17e88f247699f891.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
Controller95705e14f1a8b3ce17e88f247699f891Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller95705e14f1a8b3ce17e88f247699f891.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/sender'
*/
Controller95705e14f1a8b3ce17e88f247699f891Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller95705e14f1a8b3ce17e88f247699f891.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller95705e14f1a8b3ce17e88f247699f891.form = Controller95705e14f1a8b3ce17e88f247699f891Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
const Controller4112e708f859d15925b97409503460d5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4112e708f859d15925b97409503460d5.url(options),
    method: 'get',
})

Controller4112e708f859d15925b97409503460d5.definition = {
    methods: ["get","head"],
    url: '/qr/create/receiver',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
Controller4112e708f859d15925b97409503460d5.url = (options?: RouteQueryOptions) => {
    return Controller4112e708f859d15925b97409503460d5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
Controller4112e708f859d15925b97409503460d5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller4112e708f859d15925b97409503460d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
Controller4112e708f859d15925b97409503460d5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller4112e708f859d15925b97409503460d5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
const Controller4112e708f859d15925b97409503460d5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4112e708f859d15925b97409503460d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
Controller4112e708f859d15925b97409503460d5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4112e708f859d15925b97409503460d5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/receiver'
*/
Controller4112e708f859d15925b97409503460d5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller4112e708f859d15925b97409503460d5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller4112e708f859d15925b97409503460d5.form = Controller4112e708f859d15925b97409503460d5Form
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
const Controller0a85f3d6784b05eaf41488bea442d92f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0a85f3d6784b05eaf41488bea442d92f.url(options),
    method: 'get',
})

Controller0a85f3d6784b05eaf41488bea442d92f.definition = {
    methods: ["get","head"],
    url: '/qr/create/store',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
Controller0a85f3d6784b05eaf41488bea442d92f.url = (options?: RouteQueryOptions) => {
    return Controller0a85f3d6784b05eaf41488bea442d92f.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
Controller0a85f3d6784b05eaf41488bea442d92f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controller0a85f3d6784b05eaf41488bea442d92f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
Controller0a85f3d6784b05eaf41488bea442d92f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controller0a85f3d6784b05eaf41488bea442d92f.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
const Controller0a85f3d6784b05eaf41488bea442d92fForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0a85f3d6784b05eaf41488bea442d92f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
Controller0a85f3d6784b05eaf41488bea442d92fForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0a85f3d6784b05eaf41488bea442d92f.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/qr/create/store'
*/
Controller0a85f3d6784b05eaf41488bea442d92fForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controller0a85f3d6784b05eaf41488bea442d92f.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controller0a85f3d6784b05eaf41488bea442d92f.form = Controller0a85f3d6784b05eaf41488bea442d92fForm
/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition = {
    methods: ["get","head"],
    url: '/settings/appearance',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url = (options?: RouteQueryOptions) => {
    return Controllere19ee86e9cf603ce1a59a1ec5d21dec5.definition.url + queryParams(options)
}

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'head',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
const Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url(options),
    method: 'get',
})

/**
* @see \Inertia\Controller::__invoke
* @see vendor/inertiajs/inertia-laravel/src/Controller.php:13
* @route '/settings/appearance'
*/
Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: Controllere19ee86e9cf603ce1a59a1ec5d21dec5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

Controllere19ee86e9cf603ce1a59a1ec5d21dec5.form = Controllere19ee86e9cf603ce1a59a1ec5d21dec5Form

const Controller = {
    '/': Controller980bb49ee7ae63891f1d891d2fbcf1c9,
    '/test': Controller00777c1cd09820c6807c8fdc0ec88209,
    '/qr/create/sender': Controller95705e14f1a8b3ce17e88f247699f891,
    '/qr/create/receiver': Controller4112e708f859d15925b97409503460d5,
    '/qr/create/store': Controller0a85f3d6784b05eaf41488bea442d92f,
    '/settings/appearance': Controllere19ee86e9cf603ce1a59a1ec5d21dec5,
}

export default Controller