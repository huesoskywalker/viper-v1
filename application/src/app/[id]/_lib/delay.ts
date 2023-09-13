// most probably one day delete this , lol
export async function delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms))
}
