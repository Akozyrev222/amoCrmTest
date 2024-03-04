
const url = 'https://akozyrev222.amocrm.ru/api/v4/leads'
const proxy = 'https://corsproxy.io/?'
const access_token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjJmMTNjM2YyMTRiZDg0YjMwNjQ4M2FmMTVhNzdjYTI5YTJiYzA3NDY4M2RlNjk3MDI2MTBiMTM1MTliNzk2OTM0ZWE4YjAyYzEyMWYwODQwIn0.eyJhdWQiOiI3NzFlNzBmNy02M2ZjLTQxNzgtYWQzNy1lNGE0ZTc3YWM3NzQiLCJqdGkiOiIyZjEzYzNmMjE0YmQ4NGIzMDY0ODNhZjE1YTc3Y2EyOWEyYmMwNzQ2ODNkZTY5NzAyNjEwYjEzNTE5Yjc5NjkzNGVhOGIwMmMxMjFmMDg0MCIsImlhdCI6MTcwOTUyMzcxNywibmJmIjoxNzA5NTIzNzE3LCJleHAiOjE3MDk2MTAxMTcsInN1YiI6IjEwNzMwNTg2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxNTk3Mzg2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMWQ5N2FkYTEtN2I4NS00ODAxLWJlMTYtMDAzOTIyN2IyMGMwIn0.JrDirUwRWw-ZAFe_1B74YLDDODqWOhbFXVfA6dxzPPD_CVDc6tJO39VcLRF-jen6BAe98khVNtBAim9ZmB4aOfCuZFjpFUm9nVjRTuZlr9B_9dk972ou61aF91_cmGcwB9q9pfuqfAktDuO5_TuUjJt8_t4ZJZqZGj8R9SwMDDNl8Yy8Sd-mOpo5IAOAU2bVTjDhdI0U_c1YfKee1DY6l78G7VhIJZY6orQ9Boo1u7j4u8TEEMJkSeXWxjJZ6N2NrNMgdnCG7sfSIM5FGXWQaZstSijawJgPQ9S3zDmhZKJYFVDfzR_CR3vZpqsn-HkiweF78qEHrk_480rmVk4KiA'
const refresh_token = 'def502007f43dd45947b459daf9ac7209259c16df33893301e7ae196ad7a4a5dc2da05d57260de841cafeac2f5e7635d63369f4694bb57acd60035ca34b4385d923c330d673722597861afa78c79ea8460123350a4003b225a5246aa76b545b206be6514ab0ce11aeb26a966de89d62bba81105be341b433cf2d1fd4327e5184aaed249903b07d73984beb55181002a5c88402244e92069cdd3be8e77ae7f85254cdc8828d288f0880d39a9653e0b1a244176006a86fd3e912f0275965b340cefe61e64c0dbfd4c05309b8b633e6b35188b42da86f8ee6499acf63d99373b15d06a524cc5ea5e6eafcee6bd95fffcb3a912bb46544dd464d29c68650278efcd70192f3b13255fb872dc7f1945efda797948d21cd87ca1b0864b28ad00e26d928e51f9c6a449dadd643aae175f261123a95fa48f3c6af751f9bb992cbb01c8363fa221bfac82c87e45a2372ed0873e5ca3e3e1162cdd1002d2eda3f3f8bfa0fb8f6c43e8986bcdd066191caa12925866e53acc9208c3fe97b494d642adfdbf683891fc406e540abad99b4754743ba1b29095ab4e09aa5a171f8404d6b2ab9d712f8ac7e7cb9fa6d37da57c2f0effdbe9ca330db68925f35cdbdc39eeb466465b269223bc57cfa629d6a154bfe39d5ae7caf6ad11bd7637a832507aadc1547e4436b264fc5cfba5359511bb1f5ac23'

// constants

let result = []

// result array
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// function timeout

async function fetchDataAll(url) {
    await timeout(500)                      // задаем таймаут для функции 1 запрос каждые пол секунды (2 запроса в секунду)
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
        const data = await res.json();
        if (data._links?.next?.href) {                      // проверяем есть ли следующий эндпоинт
            result = [...result, ...data._embedded.leads]
            return fetchDataAll(proxy + data._links?.next?.href) // и возвращаем ту же функцию с новым эндпоинтом
        } else {
            result = [...result, ...data._embedded.leads]    // если эндпоинта нет добавляем содержимое запроса в результирующий массив
            result = result.map((e) => {
                return {                                    // преобразовываем нужные данные для массива
                    id: e.id,
                    name: e.name,
                    price: e.price,
                    updated_at: new Date(e.updated_at * 1000).toISOString(),
                    created_at: new Date(e.created_at * 1000).toISOString(),
                    responsible_user_id: e.responsible_user_id,
                    group_id: e.group_id,
                    status_id: e.status_id,
                    pipeline_id: e.pipeline_id,
                    closed_at: e.closed_at ? new Date(e.closed_at * 1000).toISOString() : 'Нет',
                    is_deleted: e.is_deleted ? 'Да' : 'Нет',
                    account_id: e.account_id
                }
            })
            $('table').bootstrapTable({                     // отрисовываем таблицу с обработанными данными
                data: result,
                pagination: true,
                pageList: [2, 5, 10, 'ALL']
            })
            return result
        }
        ;
    } catch (err) {
        console.log(err);
    }
}

$(document).ready(function () {
    let limit = '?limit=5'
    fetchDataAll(proxy + url + limit) // первый запрос с лимитом в 5 сделок
});

