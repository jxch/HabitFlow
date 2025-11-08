import PocketBase from 'pocketbase';

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

    login: async (email: string, pwd: string) => await pb.collection('users').authWithPassword(email, pwd),
    currentUserId: pb.authStore.isValid && pb.authStore.record ? pb.authStore.record.id : null,
    currentUser: pb.authStore.isValid && pb.authStore.record ? pb.authStore.record : null,

    batch: async (all: (batch: any) => void) => {
        const batch = pb.createBatch();
        all(batch)
        return await batch.send();
    },
}

export const batchApis = {
    users: (batch: any) => batch.collection('users'),
    habit_base: (batch: any) => batch.collection('habit_base'),
    habit_tag_base: (batch: any) => batch.collection('habit_tag_base'),
    habit_tag_link: (batch: any) => batch.collection('habit_tag_link'),
    habit_clock: (batch: any) => batch.collection('habit_clock'),
}

pb.collection('users').authWithPassword("xicheng.jiang.1@gmail.com", "2fUdJ7KcFEgdxwe")

