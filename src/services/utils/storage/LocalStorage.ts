import Storage from "./MyStorage";

export default (() => {
    return new (class SessionStorage extends Storage {})();
})();
