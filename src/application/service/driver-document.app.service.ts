import { Injectable } from '@nestjs/common';

import { DriverDocument } from '../../domain/entity/driver-document.entity';
import { DriverDocumentStatusEnum } from '../../domain/enums/driver-document-status.enum';
import { DriverDocumentRepository } from '../../infrastructure/repository/driver-document.repository';
import { DriverProfileRepository } from '../../infrastructure/repository/driver-profile.repository';
import { ListBuilder, ListInterface } from '../common/list';
import { DriverDocumentCreateRequestDto } from '../dto/driver-document/driver-document-create-request.dto';

@Injectable()
export class DriverDocumentAppService {
  constructor(
    private readonly driverDocumentRepository: DriverDocumentRepository,
    private readonly driverProfileRepository: DriverProfileRepository,
  ) {}

  async getOneById(documentId: string): Promise<DriverDocument> {
    return await this.driverDocumentRepository.getOneById(documentId);
  }

  async getAllByDriverId(
    driverId: string,
  ): Promise<ListInterface<DriverDocument>> {
    const [documents, DocumentsCount] =
      await this.driverDocumentRepository.getAllByDriverId(driverId);

    const List = new ListBuilder(documents, DocumentsCount);

    return List.build();
  }

  async uplodadDocument(
    dto: DriverDocumentCreateRequestDto,
  ): Promise<DriverDocument> {
    const driver = await this.driverProfileRepository.getOneById(dto.driverId);
    const doc = new DriverDocument();

    doc.driver = driver;
    doc.fileUrl = dto.filePath;
    doc.type = dto.documentType;
    doc.status = DriverDocumentStatusEnum.PENDING;
    if (dto.expiryDate) {
      doc.expiryDate = dto.expiryDate;
    }

    return await this.driverDocumentRepository.save(doc);
  }

  async approveDocument(documentId: string): Promise<DriverDocument> {
    const doc = await this.driverDocumentRepository.getOneById(documentId);

    doc.status = DriverDocumentStatusEnum.VALIDATED;

    const updatedDoc = await this.driverDocumentRepository.save(doc);

    // TODO: send notification to driver about approval
    return updatedDoc;
  }

  async denyDocument(documentId: string): Promise<DriverDocument> {
    const doc = await this.driverDocumentRepository.getOneById(documentId);

    doc.status = DriverDocumentStatusEnum.REJECTED;

    const updatedDoc = await this.driverDocumentRepository.save(doc);

    // TODO: send notification to driver about rejection
    return updatedDoc;
  }
}
