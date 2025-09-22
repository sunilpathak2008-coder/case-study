import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OpenAiService } from './openai.service';

describe('OpenAiService', () => {
  let service: OpenAiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenAiService]
    });
    service = TestBed.inject(OpenAiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return suggestion from API response', () => {
    const prompt = 'Suggest something';
    const mockResponse = {
      choices: [
        { message: { content: '  Hello world!  ' } }
      ]
    };
    let result: string | undefined;
    service.getSuggestion(prompt).subscribe(res => result = res);
    const req = httpMock.expectOne('/api/openai');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ prompt });
    req.flush(mockResponse);
    expect(result).toBe('Hello world!');
  });

  it('should return empty string if no suggestion in response', () => {
    const prompt = 'Suggest something';
    const mockResponse = { choices: [{}] };
    let result: string | undefined;
    service.getSuggestion(prompt).subscribe(res => result = res);
    const req = httpMock.expectOne('/api/openai');
    req.flush(mockResponse);
    expect(result).toBe('');
  });
});
