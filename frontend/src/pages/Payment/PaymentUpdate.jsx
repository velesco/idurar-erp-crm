import useLanguage from '@/lang/useLanguage';
import UpdatePaymentModule from '@/modules/PaymentModule/UpdatePaymentModule';

export default function PaymentUpdate() {
  const getLang = useLanguage();

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: getLang('payment'),
    DATATABLE_TITLE: getLang('payment_list'),
    ADD_NEW_ENTITY: getLang('add_new_payment'),
    ENTITY_NAME: getLang('payment'),
    CREATE_ENTITY: getLang('save'),
    UPDATE_ENTITY: getLang('update'),
  };

  const configPage = {
    entity,
    ...Labels,
  };
  return <UpdatePaymentModule config={configPage} />;
}
