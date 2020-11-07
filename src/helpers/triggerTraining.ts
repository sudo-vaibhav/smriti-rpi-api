import axiosForFace from './axiosForFace';

export default async (largePersonGroupId: string): Promise<{ data: Record<string, unknown> }> => {
    const resp = await axiosForFace.post(`/largePersonGroups/${largePersonGroupId}/train`);
    console.log(resp);
    if (resp.status === 202) {
        return {
            data: {
                message: 'Training triggering successful',
            },
        };
    }
    return {
        data: {
            message: 'Training triggering failed',
        },
    };
};
