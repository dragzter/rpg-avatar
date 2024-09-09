class CheckoutSessionManager {
    sessions

    constructor() {
        this.sessions = {}
    }

    createSession({session_id, user_id, product_id}) {
        this.sessions[session_id] = {
            user_id,
            session_id,
            product_id,
            created: new Date(),
            status: "pending"
        }

    }

    completeSession(session_id) {
        this.sessions[session_id].status = "complete"
    }

    getSession(session_id) {
        return this.sessions[session_id] || {}
    }

    deleteSession(session_id) {
        delete this.sessions[session_id]
    }
}

export default new CheckoutSessionManager()