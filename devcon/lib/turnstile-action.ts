/**
 * The action name the contact form's Turnstile widget is issued for; the server
 * checks the token carries it (CON-02).
 *
 * Lives here, not in the widget, because the widget is a `"use client"` module.
 * A server file importing a value from one receives a client reference, a
 * function, instead of the string. The check then compared "contact" with that
 * function and rejected every visitor (CON-02-BT-01, #199).
 */
export const TURNSTILE_ACTION = 'contact';
