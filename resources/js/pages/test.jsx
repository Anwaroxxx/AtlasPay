import { Form, Head } from '@inertiajs/react';
import React from 'react';

const Test = () => {
    return (
        <>
            {/* <Head><link href="https://cdn.jsdelivr.net/npm/daisyui@5" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script></Head> */}
            <Form
                method="post"
                action="/test/transfer"
                className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
            >
                <fieldset className="fieldset">
                    <label className="label">sender rib</label>
                    <input
                        name='from_account_rib'
                        type="text"
                        className="input validator"
                        required
                        placeholder="sender rib"
                        // pattern="[A-Za-z][A-Za-z0-9\-]*"
                        title="Only letters, numbers or dash"
                    />
                    <p className="validator-hint">
                        Must be 3 to 30 characters
                        <br />
                        containing only letters, numbers or dash
                    </p>
                    <p className="validator-hint hidden">Required</p>
                </fieldset>
                
                <fieldset className="fieldset">
                    <label className="label">reciver rib</label>
                    <input
                        name='to_account_rib'
                        type="text"
                        className="input validator"
                        required
                        placeholder="reciver rib"
                        // pattern="[A-Za-z][A-Za-z0-9\-]*"
                        title="Only letters, numbers or dash"
                    />
                    <p className="validator-hint">
                        Must be 3 to 30 characters
                        <br />
                        containing only letters, numbers or dash
                    </p>
                    <p className="validator-hint hidden">Required</p>
                </fieldset>
                <fieldset className="fieldset">
                    <label className="label">amount</label>
                    <input
                        name='amount'
                        type="number"
                        className="input validator"
                        required
                        placeholder="reciver rib"
                        // pattern="[A-Za-z][A-Za-z0-9\-]*"
                        title="Only letters, numbers or dash"
                    />
                    <p className="validator-hint">
                        Must be 3 to 30 characters
                        <br />
                        containing only letters, numbers or dash
                    </p>
                    <p className="validator-hint hidden">Required</p>
                </fieldset>

{/* 
                <label className="fieldset">
                    <span className="label">Password</span>
                    <input
                        type="password"
                        className="input validator"
                        placeholder="Password"
                        required
                    />
                    <span className="validator-hint hidden">Required</span>
                </label> */}

                <button className="btn btn-neutral mt-4" type="submit">
                    transfer
                </button>
                {/* <button className="btn btn-ghost mt-1" type="reset">
                    Reset
                </button> */}
            </Form>
        </>
    );
};

export default Test;
