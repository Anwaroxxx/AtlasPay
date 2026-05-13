import DashboardController from './DashboardController'
import ReportController from './ReportController'
import CreditController from './CreditController'
import BudgetController from './BudgetController'
import SavingsGoalController from './SavingsGoalController'
import DaretController from './DaretController'
import ChatController from './ChatController'
import TransferController from './TransferController'
import AnwarTwinController from './AnwarTwinController'
import TransactionController from './TransactionController'
import Qr from './Qr'
import Settings from './Settings'

const Controllers = {
    DashboardController: Object.assign(DashboardController, DashboardController),
    ReportController: Object.assign(ReportController, ReportController),
    CreditController: Object.assign(CreditController, CreditController),
    BudgetController: Object.assign(BudgetController, BudgetController),
    SavingsGoalController: Object.assign(SavingsGoalController, SavingsGoalController),
    DaretController: Object.assign(DaretController, DaretController),
    ChatController: Object.assign(ChatController, ChatController),
    TransferController: Object.assign(TransferController, TransferController),
    AnwarTwinController: Object.assign(AnwarTwinController, AnwarTwinController),
    TransactionController: Object.assign(TransactionController, TransactionController),
    Qr: Object.assign(Qr, Qr),
    Settings: Object.assign(Settings, Settings),
}

export default Controllers