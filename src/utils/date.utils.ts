const TIME_ZONE = "America/Manaus";

export const getManausDate = (): string => {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
};

export const getTomorrowManausDate = (): string => {
    const now = new Date();

    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);

    const year = Number(
        parts.find((p) => p.type === "year")?.value
    );

    const month = Number(
        parts.find((p) => p.type === "month")?.value
    );

    const day = Number(
        parts.find((p) => p.type === "day")?.value
    );

    const tomorrow = new Date(
        Date.UTC(year, month - 1, day + 1)
    );

    return tomorrow.toISOString().slice(0, 10);
};