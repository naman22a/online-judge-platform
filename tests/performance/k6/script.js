// export ADMIN_JWT_TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@gmail.com","password":"admin123"}' | jq -r '.accessToken')

import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 500,
    duration: '5m',
};
const token = __ENV.ADMIN_JWT_TOKEN;

export default function () {
    const payload = JSON.stringify({
        userId: 1,
        problemId: 1,
        language: 'cpp',
        code: '#include<iostream>\nusing namespace std;\nint main(){return 0;}',
        idempotencyKey: crypto.randomUUID(),
        socketId: 'sdikjd',
    });

    const res = http.post('http://localhost:5000/api/internal/submit', payload, {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });

    check(res, {
        'status 201': (r) => r.status === 201,
    });
}
