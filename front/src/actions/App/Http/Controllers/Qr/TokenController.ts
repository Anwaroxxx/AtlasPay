import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Qr\TokenController::storeSender
* @see app/Http/Controllers/Qr/TokenController.php:19
* @route '/qr/create/sender'
*/
export const storeSender = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSender.url(options),
    method: 'post',
})

storeSender.definition = {
    methods: ["post"],
    url: '/qr/create/sender',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSender
* @see app/Http/Controllers/Qr/TokenController.php:19
* @route '/qr/create/sender'
*/
storeSender.url = (options?: RouteQueryOptions) => {
    return storeSender.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSender
* @see app/Http/Controllers/Qr/TokenController.php:19
* @route '/qr/create/sender'
*/
storeSender.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSender.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSender
* @see app/Http/Controllers/Qr/TokenController.php:19
* @route '/qr/create/sender'
*/
const storeSenderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSender.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSender
* @see app/Http/Controllers/Qr/TokenController.php:19
* @route '/qr/create/sender'
*/
storeSenderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSender.url(options),
    method: 'post',
})

storeSender.form = storeSenderForm

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSenderPay
* @see app/Http/Controllers/Qr/TokenController.php:28
* @route '/qr/create/sender/quickpay'
*/
export const storeSenderPay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSenderPay.url(options),
    method: 'post',
})

storeSenderPay.definition = {
    methods: ["post"],
    url: '/qr/create/sender/quickpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSenderPay
* @see app/Http/Controllers/Qr/TokenController.php:28
* @route '/qr/create/sender/quickpay'
*/
storeSenderPay.url = (options?: RouteQueryOptions) => {
    return storeSenderPay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSenderPay
* @see app/Http/Controllers/Qr/TokenController.php:28
* @route '/qr/create/sender/quickpay'
*/
storeSenderPay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeSenderPay.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSenderPay
* @see app/Http/Controllers/Qr/TokenController.php:28
* @route '/qr/create/sender/quickpay'
*/
const storeSenderPayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSenderPay.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeSenderPay
* @see app/Http/Controllers/Qr/TokenController.php:28
* @route '/qr/create/sender/quickpay'
*/
storeSenderPayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeSenderPay.url(options),
    method: 'post',
})

storeSenderPay.form = storeSenderPayForm

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiver
* @see app/Http/Controllers/Qr/TokenController.php:33
* @route '/qr/create/receiver'
*/
export const storeReceiver = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceiver.url(options),
    method: 'post',
})

storeReceiver.definition = {
    methods: ["post"],
    url: '/qr/create/receiver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiver
* @see app/Http/Controllers/Qr/TokenController.php:33
* @route '/qr/create/receiver'
*/
storeReceiver.url = (options?: RouteQueryOptions) => {
    return storeReceiver.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiver
* @see app/Http/Controllers/Qr/TokenController.php:33
* @route '/qr/create/receiver'
*/
storeReceiver.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceiver.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiver
* @see app/Http/Controllers/Qr/TokenController.php:33
* @route '/qr/create/receiver'
*/
const storeReceiverForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReceiver.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiver
* @see app/Http/Controllers/Qr/TokenController.php:33
* @route '/qr/create/receiver'
*/
storeReceiverForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReceiver.url(options),
    method: 'post',
})

storeReceiver.form = storeReceiverForm

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:38
* @route '/qr/create/store'
*/
export const storeReceiverSTORE = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceiverSTORE.url(options),
    method: 'post',
})

storeReceiverSTORE.definition = {
    methods: ["post"],
    url: '/qr/create/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:38
* @route '/qr/create/store'
*/
storeReceiverSTORE.url = (options?: RouteQueryOptions) => {
    return storeReceiverSTORE.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:38
* @route '/qr/create/store'
*/
storeReceiverSTORE.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeReceiverSTORE.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:38
* @route '/qr/create/store'
*/
const storeReceiverSTOREForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReceiverSTORE.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::storeReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:38
* @route '/qr/create/store'
*/
storeReceiverSTOREForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeReceiverSTORE.url(options),
    method: 'post',
})

storeReceiverSTORE.form = storeReceiverSTOREForm

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
export const getPermanentMerchantToken = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermanentMerchantToken.url(options),
    method: 'get',
})

getPermanentMerchantToken.definition = {
    methods: ["get","head"],
    url: '/qr/merchant/permanent',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
getPermanentMerchantToken.url = (options?: RouteQueryOptions) => {
    return getPermanentMerchantToken.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
getPermanentMerchantToken.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermanentMerchantToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
getPermanentMerchantToken.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPermanentMerchantToken.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
const getPermanentMerchantTokenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermanentMerchantToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
getPermanentMerchantTokenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermanentMerchantToken.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::getPermanentMerchantToken
* @see app/Http/Controllers/Qr/TokenController.php:43
* @route '/qr/merchant/permanent'
*/
getPermanentMerchantTokenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getPermanentMerchantToken.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getPermanentMerchantToken.form = getPermanentMerchantTokenForm

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
export const handleScan = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleScan.url(args, options),
    method: 'get',
})

handleScan.definition = {
    methods: ["get","head"],
    url: '/qr/redirect/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
handleScan.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return handleScan.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
handleScan.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handleScan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
handleScan.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handleScan.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
const handleScanForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: handleScan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
handleScanForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: handleScan.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::handleScan
* @see app/Http/Controllers/Qr/TokenController.php:191
* @route '/qr/redirect/{id}'
*/
handleScanForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: handleScan.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

handleScan.form = handleScanForm

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
export const showToken = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showToken.url(args, options),
    method: 'get',
})

showToken.definition = {
    methods: ["get","head"],
    url: '/qr/view/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
showToken.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showToken.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
showToken.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
showToken.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showToken.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
const showTokenForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
showTokenForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showToken.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::showToken
* @see app/Http/Controllers/Qr/TokenController.php:156
* @route '/qr/view/{id}'
*/
showTokenForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showToken.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showToken.form = showTokenForm

/**
* @see \App\Http\Controllers\Qr\TokenController::confirmTransaction
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
export const confirmTransaction = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmTransaction.url(args, options),
    method: 'post',
})

confirmTransaction.definition = {
    methods: ["post"],
    url: '/qr/confirm/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::confirmTransaction
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirmTransaction.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return confirmTransaction.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::confirmTransaction
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirmTransaction.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmTransaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::confirmTransaction
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
const confirmTransactionForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmTransaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::confirmTransaction
* @see app/Http/Controllers/Qr/TokenController.php:236
* @route '/qr/confirm/{id}'
*/
confirmTransactionForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: confirmTransaction.url(args, options),
    method: 'post',
})

confirmTransaction.form = confirmTransactionForm

/**
* @see \App\Http\Controllers\Qr\TokenController::finalApproval
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
export const finalApproval = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalApproval.url(args, options),
    method: 'post',
})

finalApproval.definition = {
    methods: ["post"],
    url: '/qr/approve/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::finalApproval
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
finalApproval.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return finalApproval.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::finalApproval
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
finalApproval.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalApproval.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::finalApproval
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
const finalApprovalForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalApproval.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::finalApproval
* @see app/Http/Controllers/Qr/TokenController.php:290
* @route '/qr/approve/{id}'
*/
finalApprovalForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalApproval.url(args, options),
    method: 'post',
})

finalApproval.form = finalApprovalForm

/**
* @see \App\Http\Controllers\Qr\TokenController::cancelTransaction
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
export const cancelTransaction = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelTransaction.url(args, options),
    method: 'post',
})

cancelTransaction.definition = {
    methods: ["post"],
    url: '/qr/cancel/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::cancelTransaction
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancelTransaction.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelTransaction.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::cancelTransaction
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancelTransaction.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelTransaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::cancelTransaction
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
const cancelTransactionForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelTransaction.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::cancelTransaction
* @see app/Http/Controllers/Qr/TokenController.php:346
* @route '/qr/cancel/{id}'
*/
cancelTransactionForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelTransaction.url(args, options),
    method: 'post',
})

cancelTransaction.form = cancelTransactionForm

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
export const checkStatus = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(args, options),
    method: 'get',
})

checkStatus.definition = {
    methods: ["get","head"],
    url: '/qr/status/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
checkStatus.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return checkStatus.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
checkStatus.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
checkStatus.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkStatus.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
const checkStatusForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
checkStatusForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkStatus.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::checkStatus
* @see app/Http/Controllers/Qr/TokenController.php:337
* @route '/qr/status/{token}'
*/
checkStatusForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkStatus.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkStatus.form = checkStatusForm

/**
* @see \App\Http\Controllers\Qr\TokenController::updateSender
* @see app/Http/Controllers/Qr/TokenController.php:372
* @route '/qr/update/sender/{id}'
*/
export const updateSender = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSender.url(args, options),
    method: 'post',
})

updateSender.definition = {
    methods: ["post"],
    url: '/qr/update/sender/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::updateSender
* @see app/Http/Controllers/Qr/TokenController.php:372
* @route '/qr/update/sender/{id}'
*/
updateSender.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateSender.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::updateSender
* @see app/Http/Controllers/Qr/TokenController.php:372
* @route '/qr/update/sender/{id}'
*/
updateSender.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateSender.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateSender
* @see app/Http/Controllers/Qr/TokenController.php:372
* @route '/qr/update/sender/{id}'
*/
const updateSenderForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSender.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateSender
* @see app/Http/Controllers/Qr/TokenController.php:372
* @route '/qr/update/sender/{id}'
*/
updateSenderForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateSender.url(args, options),
    method: 'post',
})

updateSender.form = updateSenderForm

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiver
* @see app/Http/Controllers/Qr/TokenController.php:373
* @route '/qr/update/receiver/{id}'
*/
export const updateReceiver = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateReceiver.url(args, options),
    method: 'post',
})

updateReceiver.definition = {
    methods: ["post"],
    url: '/qr/update/receiver/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiver
* @see app/Http/Controllers/Qr/TokenController.php:373
* @route '/qr/update/receiver/{id}'
*/
updateReceiver.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateReceiver.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiver
* @see app/Http/Controllers/Qr/TokenController.php:373
* @route '/qr/update/receiver/{id}'
*/
updateReceiver.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateReceiver.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiver
* @see app/Http/Controllers/Qr/TokenController.php:373
* @route '/qr/update/receiver/{id}'
*/
const updateReceiverForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateReceiver.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiver
* @see app/Http/Controllers/Qr/TokenController.php:373
* @route '/qr/update/receiver/{id}'
*/
updateReceiverForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateReceiver.url(args, options),
    method: 'post',
})

updateReceiver.form = updateReceiverForm

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:374
* @route '/qr/update/store/{id}'
*/
export const updateReceiverSTORE = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateReceiverSTORE.url(args, options),
    method: 'post',
})

updateReceiverSTORE.definition = {
    methods: ["post"],
    url: '/qr/update/store/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:374
* @route '/qr/update/store/{id}'
*/
updateReceiverSTORE.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateReceiverSTORE.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:374
* @route '/qr/update/store/{id}'
*/
updateReceiverSTORE.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateReceiverSTORE.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:374
* @route '/qr/update/store/{id}'
*/
const updateReceiverSTOREForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateReceiverSTORE.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Qr\TokenController::updateReceiverSTORE
* @see app/Http/Controllers/Qr/TokenController.php:374
* @route '/qr/update/store/{id}'
*/
updateReceiverSTOREForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateReceiverSTORE.url(args, options),
    method: 'post',
})

updateReceiverSTORE.form = updateReceiverSTOREForm

const TokenController = { storeSender, storeSenderPay, storeReceiver, storeReceiverSTORE, getPermanentMerchantToken, handleScan, showToken, confirmTransaction, finalApproval, cancelTransaction, checkStatus, updateSender, updateReceiver, updateReceiverSTORE }

export default TokenController