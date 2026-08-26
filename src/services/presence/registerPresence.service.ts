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
    console.log("\n========== REGISTER PRESENCE ==========");
    console.log("[PRESENCE] Dados recebidos:");
    console.log({
        id,
        phone,
        date,
        time,
    });

    console.log("[PRESENCE] Store antes:");
    console.log(presenceStore);

    const exists = presenceStore.some(
        presence =>
            presence.id === id &&
            presence.phone === phone
    );

    console.log("[PRESENCE] Já existe?", exists);

    if (exists) {
        console.log("[PRESENCE] Presença já registrada. Não adicionando.");
        console.log("=======================================\n");
        return;
    }

    presenceStore.push({
        id,
        phone,
        date,
        time,
        status: "pending",
    });


    console.log("[PRESENCE] Presença adicionada com sucesso!");

    console.log("[PRESENCE] Store depois:");
    console.log(presenceStore);

    console.log("=======================================\n");
};

export default registerPresenceService;