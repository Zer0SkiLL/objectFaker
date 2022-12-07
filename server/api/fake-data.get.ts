import { getFakeData } from '../lib/faker';

export default defineEventHandler((event) => {
    const query = useQuery(event);

    const data = getFakeData(query.type, query.config);

    return { data };
});
