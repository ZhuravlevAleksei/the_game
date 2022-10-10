export default function getProperty(name, dict) {
    if (name in dict) {
        return dict[name];
    }

    throw new Error(`Property "${name}" is not defined`);
}
