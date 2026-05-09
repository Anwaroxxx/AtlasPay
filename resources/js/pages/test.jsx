import { Form, Head } from '@inertiajs/react';
import React from 'react';

const Test = () => {
    return (
        <>
            <Form
                method="post"
                action={`qr/pay/${1}`}
                className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            >
                <button className="btn btn-neutral mt-4" type="submit">
                    transfer
                </button>
            </Form>
        </>
    );
};

export default Test;
