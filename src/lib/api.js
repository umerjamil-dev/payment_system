const BASE_URL = 'http://localhost:8000/api';

const handleResponse = async (response) => {
    try {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'API Request failed' }));
            return { data: null, error: errorData };
        }
        if (response.status === 204) return { data: null, error: null };
        return { data: await response.json(), error: null };
    } catch (e) {
        return { data: null, error: { message: e.message || 'Network error' } };
    }
};

export const api = {
    async get(path) {
        try {
            const response = await fetch(`${BASE_URL}/${path}`);
            return await handleResponse(response);
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    async post(path, body) {
        try {
            const response = await fetch(`${BASE_URL}/${path}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return await handleResponse(response);
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    async put(path, body) {
        try {
            const response = await fetch(`${BASE_URL}/${path}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            return await handleResponse(response);
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    async delete(path) {
        try {
            const response = await fetch(`${BASE_URL}/${path}`, {
                method: 'DELETE',
            });
            return await handleResponse(response);
        } catch (error) {
            return { data: null, error: { message: error.message } };
        }
    },

    // To mimic Supabase-like query structure if needed, or just use these directly
    database: {
        from(resource) {
            const createChainable = (promise) => {
                promise.select = () => promise;
                promise.match = (f) => {
                    return promise;
                };
                promise.single = () => promise;
                return promise;
            };

            return {
                select: (query) => {
                    return {
                        match: (f) => {
                            const promise = api.get(`${resource}/${f.id || f.key || ''}`);
                            return createChainable(promise);
                        },
                        then: (cb) => api.get(resource).then(cb)
                    };
                },
                insert: (data) => {
                    const sendData = Array.isArray(data) && data.length === 1 ? data[0] : data;
                    const promise = api.post(resource, sendData).then(res => ({
                        ...res,
                        data: Array.isArray(res.data) ? res.data : (res.data ? [res.data] : [])
                    }));
                    return createChainable(promise);
                },
                update: (data) => ({
                    match: (f) => {
                        const promise = api.put(`${resource}/${f.id || f.key || ''}`, data).then(res => ({
                            ...res,
                            data: Array.isArray(res.data) ? res.data : (res.data ? [res.data] : [])
                        }));
                        return createChainable(promise);
                    }
                }),
                delete: () => ({
                    match: (f) => {
                        const promise = api.delete(`${resource}/${f.id || f.key || ''}`);
                        return createChainable(promise);
                    }
                }),
                upsert: (data) => {
                    const promise = api.post(`${resource}/${data.key || data.id || ''}`, data);
                    return createChainable(promise);
                },
                match: (f) => {
                    return {
                        single: () => {
                            const promise = api.get(`${resource}/${f.id || f.key || ''}`);
                            return createChainable(promise);
                        }
                    };
                }
            };
        }
    }
};
