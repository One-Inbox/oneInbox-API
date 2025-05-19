INSERT INTO MsgReceiveds (
    id,
    name,
    fromData,
    payload,
    timestamp,
    BusinessId,
    ContactId,
    chatId
  )
VALUES (
    'id:uuid',
    'name:text',
    'fromData:json',
    'payload:json',
    'timestamp:bigint',
    'BusinessId:uuid',
    'ContactId:uuid',
    'chatId:bigint'
  );