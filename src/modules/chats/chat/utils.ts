export const getMaskedHtmlMessage = (
    { message, piiToEntityMapData, isUser, noHighlight = false }:
        { isUser: boolean, message: string; noHighlight?: boolean; piiToEntityMapData: { key: string; label: string }[] }
): string => {
    let updatedMessage = message
    piiToEntityMapData.forEach((item) => {
        if (isUser) {
            updatedMessage = updatedMessage.replace(new RegExp(`${item.key}`, "g"), noHighlight ? item.key : `<span class="redact-content" data-tooltip-id="tooltip-${item.key}"}>${item.key}</span>`)
        } else {
            updatedMessage = updatedMessage.replace(new RegExp(`<${item.label}>`, "g"), item.key)
        }
    })
    return updatedMessage
};