import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
    vus: 20,          // Number of concurrent users
    duration: "30s",  // How long to run the test
};

const BASE_URL = "http://localhost:2500/api";

export default function () {
    // 1. Unique email per VU+iteration
    const email = `user_${__VU}_${__ITER}@test.com`;
    const password = "password123";

    // 2. Signup
    let signupRes = http.post(`${BASE_URL}/auth/signup`, JSON.stringify({
        name: "Test User",
        email: email,
        password: password,
        confirmPassword: password,
        phone: "1234567890",
        city: "Test City"
    }), {
        headers: { "Content-Type": "application/json" },
    });

    check(signupRes, {
        "signup status is 201 or 409": (r) => r.status === 201 || r.status === 409,
    });

    // 3. Login
    let loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
        email: email,
        password: password,
    }), {
        headers: { "Content-Type": "application/json" },
    });

    check(loginRes, {
        "login success": (r) => r.status === 200,
    });

    const token = loginRes.json("token");
    const authHeaders = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    };

    // 4. Hit protected routes
    // let bookmarkRes = http.get(`${BASE_URL}/bookmark`, authHeaders);
    // check(bookmarkRes, { "bookmark route works": (r) => r.status === 200 });

    let reviewsRes = http.get(`${BASE_URL}/reviews/vendor/6888e4bfce76584602ea026e`, authHeaders);
    check(reviewsRes, { "reviews route works": (r) => r.status === 200 });

    let profileRes = http.get(`${BASE_URL}/profile/`, authHeaders);
    check(profileRes, { "profile route works": (r) => r.status === 200 });

    let serviceProvidersRes = http.get(`${BASE_URL}/serviceProvidersList/`, authHeaders);
    check(serviceProvidersRes, { "service route works": (r) => r.status === 200 });

    sleep(1); // wait 1s before next iteration
}
