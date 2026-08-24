import { presenceStore } from "../../store/presence.store";

interface RegisterPresenceParams {
    id: string;
    phone: string;
    date?: string;
    time?: string;
}

const registerPresenceService = ({
    id,
    phone,
    date,
    time,
}: RegisterPresenceParams) => {

    const exists = presenceStore.some(
        presence =>
            presence.id === id &&
            presence.phone === phone
    );

    if (exists) {
        return;
    }

    presenceStore.push({
        id,
        phone,
        date,
        time,
        status: "pending",
    });
};

export default registerPresenceService;