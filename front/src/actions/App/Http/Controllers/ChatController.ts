import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ChatController::ask
* @see app/Http/Controllers/ChatController.php:12
* @route '/chat'
*/
export const ask = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

ask.definition = {
    methods: ["post"],
    url: '/chat',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ChatController::ask
* @see app/Http/Controllers/ChatController.php:12
* @route '/chat'
*/
ask.url = (options?: RouteQueryOptions) => {
    return ask.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ChatController::ask
* @see app/Http/Controllers/ChatController.php:12
* @route '/chat'
*/
ask.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ask.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::ask
* @see app/Http/Controllers/ChatController.php:12
* @route '/chat'
*/
const askForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ChatController::ask
* @see app/Http/Controllers/ChatController.php:12
* @route '/chat'
*/
askForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: ask.url(options),
    method: 'post',
})

ask.form = askForm

const ChatController = { ask }

export default ChatController