import {ponder} from "ponder:registry";
import {
    attendSessionEvent,
    createEvent as eventTable,
    createSession,
    enrollEvent,
    eventTag,
    organizerClaimHistory,
    organizerClaimUnattendedHistory
} from "../ponder.schema";
// import {sendEventToEsb} from "./soa/sendEventToEsb";


// ponder.on("WeCan:Transfer", async ({event, context}) => {
//
//     console.log("Transfer detected", JSON.stringify(event, (key, value) =>
//         typeof value === "bigint" ? Number(value) : value,
//     ))
//
//     await context.db
//         .insert(account)
//         .values({
//             id: event.transaction.hash,
//             from: event.args.from,
//             to: event.args.to,
//             amount: event.args.value,
//         })
//         .onConflictDoUpdate((row) => ({})
//         )
//
// })

// ponder.on("WeCanUpdate:block", async ({event, context}) => {
// Fetch the price at the current block height (1000, 1010, 1020, etc.)
// console.log(event)
//
// const donationLength = await context.client.readContract({
//     abi: WeCanAbi,
//     address: WeCanAddress,
//     functionName: "getDonationsAddressLength"
// });
//
// console.log(donationLength)
//
// });

ponder.on("LetsCommit:CreateEvent", ({event, context}) => {

    context.db
        .insert(eventTable)
        .values({
            id: event.args.eventId,
            title: event.args.title,
            description: event.args.description,
            imageUri: event.args.imageUri,
            priceAmount: event.args.priceAmount,
            commitmentAmount: event.args.commitmentAmount,
            totalSession: event.args.totalSession,
            startSaleDate: event.args.startSaleDate,
            endSaleDate: event.args.endSaleDate,
            organizer: event.args.organizer,
        })
        .onConflictDoNothing();

    event.args.tag
        .filter((tag) => tag !== '')
        .forEach((tag, index) => {
            context.db
                .insert(eventTag)
                .values({
                    id: event.args.eventId,
                    index,
                    tagName: tag,
                })
                .onConflictDoNothing()
        })
});

ponder.on("LetsCommit:CreateSession", ({event, context}) => {
    context.db
        .insert(createSession)
        .values({
            id: event.args.eventId,
            session: event.args.session,
            title: event.args.title,
            startSessionTime: event.args.startSessionTime,
            endSessionTime: event.args.endSessionTime,
            // attendToken: '0x0'
        })
        .onConflictDoNothing();

});


ponder.on("LetsCommit:EnrollEvent", ({event, context}) => {

    context.db
        .insert(enrollEvent)
        .values({
            id: event.args.eventId,
            participant: event.args.participant,
            debitAmount: event.args.debitAmount,
        })
        .onConflictDoNothing();

});

ponder.on("LetsCommit:AttendEventSession", ({event, context}) => {

    context.db
        .insert(attendSessionEvent)
        .values({
            id: event.args.eventId,
            session: event.args.session,
            participant: event.args.participant,
            attendToken: event.args.attendToken,
        })
        .onConflictDoNothing();

});

ponder.on("LetsCommit:OrganizerFirstClaim", ({event, context}) => {

    context.db
        .insert(organizerClaimHistory)
        .values({
            id: event.args.eventId,
            condition: 'F',
            organizer: event.args.organizer,
            claimAmount: event.args.claimAmount
        })
        .onConflictDoNothing();

});

ponder.on("LetsCommit:OrganizerLastClaim", ({event, context}) => {

    context.db
        .insert(organizerClaimHistory)
        .values({
            id: event.args.eventId,
            condition: 'L',
            organizer: event.args.organizer,
            claimAmount: event.args.claimAmount
        })
        .onConflictDoNothing();

});

ponder.on("LetsCommit:OrganizerClaimUnattended", ({event, context}) => {

    context.db
        .insert(organizerClaimUnattendedHistory)
        .values({
            id: event.args.eventId,
            session: event.args.session,
            unattendedPerson: event.args.unattendedPerson,
            organizer: event.args.organizer,
            claimAmount: event.args.claimAmount,
        })
        .onConflictDoNothing();

});