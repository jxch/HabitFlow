import PocketBase from 'pocketbase';
import dayjs from "dayjs";

export const pb = new PocketBase('https://pocketbase.jiangxicheng.xyz/');

export const apis = {
    users: pb.collection('users'),
    habit_base: pb.collection('habit_base'),
    habit_tag_base: pb.collection('habit_tag_base'),
    habit_tag_link: pb.collection('habit_tag_link'),
    habit_clock: pb.collection('habit_clock'),

    habit_view_clock: pb.collection('habit_view_clock'),
    habit_view_clock_number: pb.collection('habit_view_clock_number'),
    habit_view_tag_clock_number: pb.collection('habit_view_tag_clock_number'),

    currentUserId: pb.authStore.isValid && pb.authStore.record ? pb.authStore.record.id : null,
    currentUser: pb.authStore.isValid && pb.authStore.record ? pb.authStore.record : null,
}

export const batchApis = {
    users: (batch: any) => batch.collection('users'),
    habit_base: (batch: any) => batch.collection('habit_base'),
    habit_tag_base: (batch: any) => batch.collection('habit_tag_base'),
    habit_tag_link: (batch: any) => batch.collection('habit_tag_link'),
    habit_clock: (batch: any) => batch.collection('habit_clock'),

    batch: async (all: (batch: any) => void) => {
        const batch = pb.createBatch();
        all(batch)
        return await batch.send();
    },
}

export const business = {
    login: async (email: string, pwd: string) => await pb.collection('users').authWithPassword(email, pwd),
    redoTodayClock: async (habit_id: string) => {
        const items = await apis.habit_view_clock_number.getFullList({
            filter: `habit_id = '${habit_id}' && clock_day = '${dayjs().format('YYYY-MM-DD')}'`
        });

        if (!items || items.length === 0) {
            return;
        }

        const deletePromises = items.flatMap(item =>
            String(item.clock_ids || '').split(',').map(id => apis.habit_clock.delete(id)));

        return Promise.all(deletePromises);
    }
}

pb.collection('users').authWithPassword("xicheng.jiang.1@gmail.com", "2fUdJ7KcFEgdxwe")

