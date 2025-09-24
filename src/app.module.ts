import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AccessibilityFeatureAppService } from './application/service/accessibility-feature.app.service';
import { AccessibilityMatchingAppService } from './application/service/accessibility-matching.app.service';
import { AuthSessionService } from './application/service/auth-session.service';
import { AuthService } from './application/service/auth.service';
import { CustomerProfileAppService } from './application/service/customer-profile.app.service';
import { DriverCommissionAppService } from './application/service/driver-commission.app.service';
import { DriverDocumentAppService } from './application/service/driver-document.app.service';
import { DriverLocationAppService } from './application/service/driver-location.app.service';
import { DriverProfileAppService } from './application/service/driver-profile.app.service';
import { ReservationExecutionAppService } from './application/service/reservation-execution.app.service';
import { ReservationAppService } from './application/service/reservation.app.service';
import { UserAccessibilityAppService } from './application/service/user-accessibility.app.service';
import { UserAppService } from './application/service/user.app.service';
import { VehicleAccessibilityAppService } from './application/service/vehicle-accessibility.app.service';
import { VehicleCategoryAppService } from './application/service/vehicle-category.app.service';
import { VehicleAppService } from './application/service/vehicle.app.service';
import { ReservationService } from './domain/service/reservation.service';
import { UserService } from './domain/service/user.service';
import { appDataSource } from './infrastructure/app-data-source';
import { eventEmitterConfig } from './infrastructure/common/event-emitter.config';
import { AccessibilityFeatureController } from './infrastructure/controller/accessibility-feature.controller';
import { AuthController } from './infrastructure/controller/auth.controller';
import { CustomerProfileController } from './infrastructure/controller/customer-profile.controller';
import { DriverCommissionController } from './infrastructure/controller/driver-commission.controller';
import { DriverDocumentController } from './infrastructure/controller/driver-document.controller';
import { DriverLocationController } from './infrastructure/controller/driver-location.controller';
import { DriverProfileController } from './infrastructure/controller/driver-profile.controller';
import { ReservationController } from './infrastructure/controller/reservation.controller';
import { UserAccessibilityController } from './infrastructure/controller/user-accessibility.controller';
import { UserController } from './infrastructure/controller/user.controller';
import { VehicleAccessibilityController } from './infrastructure/controller/vehicle-accessibility.controller';
import { VehicleCategoryController } from './infrastructure/controller/vehicle-category.controller';
import { VehicleController } from './infrastructure/controller/vehicle.controller';
import { JwtAuthGuard } from './infrastructure/decorator/auth/jwt-auth.guard';
import { RolesGuard } from './infrastructure/decorator/auth/roles.guard';
import { DriverLocationGateway } from './infrastructure/gateway/driver-location.gateway';
import { AccessibilityFeatureRepository } from './infrastructure/repository/accessibility-feature.repository';
import { AuthSessionRepository } from './infrastructure/repository/auth-session.repository';
import { CustomerProfileRepository } from './infrastructure/repository/customer-profile.repository';
import { DriverCommissionRepository } from './infrastructure/repository/driver-commission.repository';
import { DriverDocumentRepository } from './infrastructure/repository/driver-document.repository';
import { DriverLocationRepository } from './infrastructure/repository/driver-location.repository';
import { DriverProfileRepository } from './infrastructure/repository/driver-profile.repository';
import { ReservationEventRepository } from './infrastructure/repository/reservation-event.repository';
import { ReservationRepository } from './infrastructure/repository/reservation.repository';
import { UserAccessibilityRepository } from './infrastructure/repository/user-accessibility.repository';
import { UserRepository } from './infrastructure/repository/user.repository';
import { VehicleAccessibilityRepository } from './infrastructure/repository/vehicle-accessibility.repository';
import { VehicleCategoryRepository } from './infrastructure/repository/vehicle-category.repository';
import { VehicleRepository } from './infrastructure/repository/vehicle.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(appDataSource.options),
    EventEmitterModule.forRoot(eventEmitterConfig),
    ScheduleModule.forRoot(),
  ],
  controllers: [
    /* Controller Providers */
    UserController,
    CustomerProfileController,
    DriverProfileController,
    AuthController,
    DriverDocumentController,
    VehicleCategoryController,
    VehicleController,
    AccessibilityFeatureController,
    UserAccessibilityController,
    VehicleAccessibilityController,
    DriverCommissionController,
    ReservationController,
    DriverLocationController,
  ],

  providers: [
    /* Domain Service Providers */
    UserService,
    AuthService,
    AuthSessionService,
    ReservationService,

    /* Repository Providers */
    UserRepository,
    DriverProfileRepository,
    CustomerProfileRepository,
    AuthSessionRepository,
    DriverDocumentRepository,
    VehicleCategoryRepository,
    VehicleRepository,
    AccessibilityFeatureRepository,
    UserAccessibilityRepository,
    VehicleAccessibilityRepository,
    DriverCommissionRepository,
    ReservationRepository,
    ReservationEventRepository,
    DriverLocationRepository,

    /* App Service Providers */
    UserAppService,
    DriverProfileAppService,
    CustomerProfileAppService,
    DriverDocumentAppService,
    VehicleCategoryAppService,
    VehicleAppService,
    AccessibilityFeatureAppService,
    AccessibilityMatchingAppService,
    UserAccessibilityAppService,
    VehicleAccessibilityAppService,
    DriverCommissionAppService,
    ReservationAppService,
    ReservationExecutionAppService,
    DriverLocationAppService,

    DriverLocationGateway,

    /* Global Security Guards */
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
